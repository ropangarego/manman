import { useState } from 'react';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import { useAppStore, type ReportContext } from '../../stores/appStore';
import { Button } from '../ui/Button';
import { OptionSheet } from '../ui/OptionSheet';

interface ReportIssueModalProps {
  context: ReportContext | null;
  open: boolean;
  onClose: () => void;
}

export function ReportIssueModal({ context, open, onClose }: ReportIssueModalProps) {
  const language = useAppStore((state) => state.settings.language);
  const showToast = useAppStore((state) => state.showToast);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  return (
    <OptionSheet
      open={open}
      title={language === 'Indonesian' ? 'Laporkan masalah' : 'Report an issue'}
      sub={
        language === 'Indonesian'
          ? 'Kirim catatan singkat agar kami bisa memeriksa konten ini.'
          : 'Send a quick note so we can review this content.'
      }
      className="report-sheet"
      onClose={onClose}
    >
      <form
        className="sheet-form"
        onSubmit={async (event) => {
          event.preventDefault();

          if (busy) {
            return;
          }

          setBusy(true);
          setError('');

          try {
            if (!isSupabaseConfigured || !supabase) {
              showToast(language === 'Indonesian' ? 'Laporan tersimpan.' : 'Thanks, report submitted.');
              setMessage('');
              onClose();
              return;
            }

            const {
              data: { user },
              error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) {
              setError(language === 'Indonesian' ? 'Silakan masuk dulu.' : 'Please sign in first.');
              return;
            }

            const { error: insertError } = await supabase.from('issue_reports').insert({
              user_id: user.id,
              page: context?.page ?? null,
              pack_id: context?.packId ?? null,
              item_type: context?.itemType ?? null,
              item_id: context?.itemId ?? null,
              message: message.trim() || null,
              metadata: context?.metadata ?? {},
              status: 'open',
            });

            if (insertError) {
              setError(insertError.message);
              return;
            }

            showToast(language === 'Indonesian' ? 'Terima kasih, laporan terkirim.' : 'Thanks, report submitted.');
            setMessage('');
            onClose();
          } finally {
            setBusy(false);
          }
        }}
      >
        <label>
          <span>{language === 'Indonesian' ? 'Catatan opsional' : 'Optional message'}</span>
          <textarea
            value={message}
            placeholder={language === 'Indonesian' ? 'Apa yang perlu diperiksa?' : 'What should we check?'}
            onChange={(event) => setMessage(event.target.value)}
          />
        </label>
        <div className="sheet-actions">
          <Button variant="secondary" type="button" onClick={onClose}>
            {language === 'Indonesian' ? 'Batal' : 'Cancel'}
          </Button>
          <Button type="submit" disabled={busy}>
            {busy ? (language === 'Indonesian' ? 'Mengirim...' : 'Sending...') : language === 'Indonesian' ? 'Kirim laporan' : 'Submit report'}
          </Button>
        </div>
        {error ? (
          <p className="auth-note auth-error" role="alert">
            {error}
          </p>
        ) : null}
      </form>
    </OptionSheet>
  );
}

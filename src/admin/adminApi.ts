import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { AdminItemType, IssueReport, QaReview, QaStatus } from './adminData';

export async function getQaReviews(packId?: string) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: [] as QaReview[], error: null };
  }

  let query = supabase.from('content_qa_reviews').select('*').order('updated_at', { ascending: false });
  if (packId) {
    query = query.eq('pack_id', packId);
  }

  const { data, error } = await query;
  return { data: (data ?? []) as QaReview[], error };
}

export async function upsertQaReview(input: {
  packId: string;
  itemType: AdminItemType;
  itemId: string;
  status: QaStatus;
  note: string;
}) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: null };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return { data: null, error: userError };
  }

  const { data, error } = await supabase
    .from('content_qa_reviews')
    .upsert(
      {
        reviewer_id: user?.id ?? null,
        pack_id: input.packId,
        item_type: input.itemType,
        item_id: input.itemId,
        status: input.status,
        note: input.note.trim() || null,
      },
      { onConflict: 'pack_id,item_type,item_id' },
    )
    .select('*')
    .single();

  return { data: data as QaReview | null, error };
}

export async function getIssueReports() {
  if (!isSupabaseConfigured || !supabase) {
    return { data: [] as IssueReport[], error: null };
  }

  const { data, error } = await supabase.from('issue_reports').select('*').order('created_at', { ascending: false });
  return { data: (data ?? []) as IssueReport[], error };
}

export async function updateIssueReport(id: string, patch: Pick<IssueReport, 'status'> & { admin_note: string | null }) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: null };
  }

  const { data, error } = await supabase
    .from('issue_reports')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single();

  return { data: data as IssueReport | null, error };
}

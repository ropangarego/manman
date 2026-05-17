import { AnswerGrid } from '../components/study/AnswerGrid';
import { StudyItemCard } from '../components/study/StudyItemCard';
import { StudyProgress } from '../components/study/StudyProgress';
import { ToneDots } from '../components/study/ToneDots';
import { AudioButton } from '../components/ui/AudioButton';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import {
  getStarterStudySession,
  sessionPlans,
  studyQuestionForItem,
  typeLabel,
  type ContentItem,
} from '../data/mockContent';
import { useAppStore } from '../stores/appStore';
import { useProgressStore } from '../stores/progressStore';
import { useStudyStore } from '../stores/studyStore';
import { useTranslation } from '../i18n/useTranslation';
import { speakMandarin, speechRateForSpeed } from '../utils/audio';

function PinyinLine({ pinyin, tones, show = true }: { pinyin: string[]; tones: number[]; show?: boolean }) {
  if (!show) {
    return null;
  }

  return (
    <>
      <div className="pinyin-line">
        {pinyin.map((syllable, index) => (
          <span key={`${syllable}-${index}`}>{syllable}</span>
        ))}
      </div>
      <ToneDots tones={tones} />
    </>
  );
}

function ExampleBlock({ item, showPinyin }: { item: ContentItem; showPinyin: boolean }) {
  return (
    <p>
      <b>{item.example[0]}</b>
      <br />
      {showPinyin ? (
        <>
          {item.example[1]}
          <br />
        </>
      ) : null}
      {item.example[2]}
    </p>
  );
}

function progressMode(step: ReturnType<typeof useStudyStore.getState>['step'], t: ReturnType<typeof useTranslation>['t']) {
  if (step === 'intro') {
    return t('study.sessionPlan');
  }

  if (step === 'learn') {
    return t('study.learningNew');
  }

  if (step === 'practice') {
    return t('study.quickPractice');
  }

  if (step === 'review') {
    return t('study.reviewDue');
  }

  if (step === 'summary') {
    return t('study.summary');
  }

  return t('study.unlockedContent');
}

function completedCount(
  step: ReturnType<typeof useStudyStore.getState>['step'],
  learnIndex: number,
  reviewIndex: number,
  learnCount: number,
  total: number,
) {
  if (step === 'intro') {
    return 0;
  }

  if (step === 'learn') {
    return learnIndex * 2;
  }

  if (step === 'practice') {
    return learnIndex * 2 + 1;
  }

  if (step === 'review') {
    return learnCount * 2 + reviewIndex;
  }

  return total;
}

export function StudyScreen() {
  const { language, t } = useTranslation();
  const sessionSize = useAppStore((state) => state.sessionSize);
  const pinyinDisplay = useAppStore((state) => state.settings.pinyinDisplay);
  const speechSpeed = useAppStore((state) => state.settings.speechSpeed);
  const hints = useAppStore((state) => state.settings.hints);
  const openSheet = useAppStore((state) => state.openSheet);
  const setScreen = useAppStore((state) => state.setScreen);
  const step = useStudyStore((state) => state.step);
  const sessionIndex = useStudyStore((state) => state.sessionIndex);
  const learnIndex = useStudyStore((state) => state.learnIndex);
  const reviewIndex = useStudyStore((state) => state.reviewIndex);
  const sessionCorrect = useStudyStore((state) => state.sessionCorrect);
  const sessionAttempts = useStudyStore((state) => state.sessionAttempts);
  const selectedPractice = useStudyStore((state) => state.selectedPractice);
  const selectedReview = useStudyStore((state) => state.selectedReview);
  const feedback = useStudyStore((state) => state.feedback);
  const setStep = useStudyStore((state) => state.setStep);
  const startNextSession = useStudyStore((state) => state.startNextSession);
  const choosePracticeAnswer = useStudyStore((state) => state.choosePracticeAnswer);
  const chooseReviewAnswer = useStudyStore((state) => state.chooseReviewAnswer);
  const finishPractice = useStudyStore((state) => state.finishPractice);
  const finishReview = useStudyStore((state) => state.finishReview);
  const recordAnswer = useProgressStore((state) => state.recordAnswer);
  const completeSession = useProgressStore((state) => state.completeSession);
  const plan = sessionPlans[sessionSize];
  const showLearningPinyin = pinyinDisplay !== 'Hidden in review' && pinyinDisplay !== 'Off';
  const showReviewPinyin = pinyinDisplay === 'Always';
  const speechRate = speechRateForSpeed(speechSpeed);
  const session = getStarterStudySession(sessionSize, sessionIndex, language);
  const learnItem = session.learnItems[learnIndex] ?? session.learnItems[0];
  const reviewItem = session.reviewItems[reviewIndex] ?? session.reviewItems[0];
  const practice = studyQuestionForItem(learnItem, t('study.quickPractice'), true, language);
  const review = studyQuestionForItem(reviewItem, t('study.reviewDue'), false, language);
  const totalTasks = session.learnItems.length * 2 + session.reviewItems.length;
  const completed = completedCount(step, learnIndex, reviewIndex, session.learnItems.length, totalTasks);
  const hasMoreLearnItems = learnIndex < session.learnItems.length - 1;
  const hasMoreReviewItems = reviewIndex < session.reviewItems.length - 1;
  const sessionAccuracy = sessionAttempts > 0 ? `${Math.round((sessionCorrect / sessionAttempts) * 100)}%` : '100%';

  return (
    <div className="study-shell">
      <StudyProgress
        completed={completed}
        total={totalTasks}
        mode={progressMode(step, t)}
        completedLabel={t('study.completed')}
        sessionLabel={t('study.session')}
      />

      {step === 'intro' ? (
        <Card className="study-card session-intro">
          <span className="pill accent">{session.packLabel}</span>
          <div>
            <h3>{session.introTitle}</h3>
            <p>
              {language === 'Indonesian'
                ? `${session.learnItems.length} kata baru · ${session.reviewItems.length} review`
                : `${session.learnItems.length} new words · ${session.reviewItems.length} reviews`}
              <br />
              <span className="duration-line">{t('home.duration')}: {plan.duration}</span>
            </p>
            <p>{session.introDescription}</p>
          </div>
          <div className="intro-stats">
            <StatCard value={session.learnItems.length} label={t('study.new')} />
            <StatCard value={session.reviewItems.length} label={t('study.reviews')} />
            <StatCard value={plan.duration.replace('~', '')} label={t('home.duration')} />
          </div>
          <Button type="button" onClick={() => setStep('learn')}>
            {t('study.start')}
          </Button>
        </Card>
      ) : null}

      {step === 'learn' ? (
        <section className="study-card desktop-wide learn-layout">
          <StudyItemCard
            type={typeLabel(learnItem.type, language)}
            title={learnItem.title}
            pinyin={learnItem.pinyin}
            tones={learnItem.tones}
            meaning={learnItem.meaning}
            audioUrl={learnItem.audioUrl}
            showPinyin={showLearningPinyin}
          />
          <div className="study-card learn-side">
            {hints && showLearningPinyin ? (
              <div className="tone-helper">
                <b>{t('study.tip')}</b>
                <span>{t('study.tipText')}</span>
              </div>
            ) : null}
            <Card className="study-info-card">
              <h3>{t('study.buildGreeting')}</h3>
              <div className="component-grid">
                {learnItem.components.map(([label, meaning]) => (
                  <div className="mini-box" key={`${label}-${meaning}`}>
                    <b>{label}</b>
                    <small>{meaning}</small>
                  </div>
                ))}
              </div>
              <p>
                <b>{learnItem.title}</b> {language === 'Indonesian' ? 'berarti' : 'means'} {learnItem.meaning}. {learnItem.mnemonic}
              </p>
            </Card>
            <Card className="study-info-card">
              <h3>{language === 'Indonesian' ? 'Contoh' : 'Example'}</h3>
              <ExampleBlock item={learnItem} showPinyin={showLearningPinyin} />
            </Card>
            <Button type="button" onClick={() => setStep('practice')}>
              {t('study.practiceThis')}
            </Button>
          </div>
        </section>
      ) : null}

      {step === 'practice' ? (
        <Card className="study-card practice-layout">
          <div className="review-card">
            <p className="muted">{practice.modeLabel}</p>
            <h3>{practice.prompt}</h3>
            <div className="pronunciation-stack review-pronunciation">
              <div className="review-char mandarin-text">{learnItem.title}</div>
              <PinyinLine pinyin={learnItem.pinyin} tones={learnItem.tones} show={showLearningPinyin} />
              <AudioButton
                audioSrc={learnItem.audioUrl}
                variant="centeredBelow"
                label={`Play pronunciation for ${learnItem.title}`}
                onPlay={() => speakMandarin(learnItem.title, speechRate)}
              />
            </div>
            <button className="report-menu" type="button" aria-label="Report issue" onClick={() => openSheet('report')}>
              ⋯
            </button>
          </div>
          <div className="practice-side">
            <AnswerGrid
              answers={practice.answers}
              correctAnswer={practice.correctAnswer}
              selectedAnswer={selectedPractice}
              disabled={selectedPractice === practice.correctAnswer}
              onSelect={(answer) => {
                choosePracticeAnswer(
                  answer,
                  practice.correctAnswer,
                  practice.correctFeedback,
                  practice.wrongFeedback,
                );
                recordAnswer(learnItem, answer === practice.correctAnswer);
              }}
            />
            {feedback ? <div className={`feedback ${selectedPractice === practice.correctAnswer ? 'good' : 'bad'}`}>{feedback}</div> : null}
            {selectedPractice === practice.correctAnswer ? (
              <Button type="button" onClick={() => finishPractice(hasMoreLearnItems)}>
                {t('common.next')}
              </Button>
            ) : null}
          </div>
        </Card>
      ) : null}

      {step === 'review' ? (
        <Card className="study-card practice-layout">
          <div className="review-card">
            <p className="muted">{review.modeLabel}</p>
            <h3>{review.prompt}</h3>
            <div className="pronunciation-stack review-pronunciation">
              <div className="review-char mandarin-text">{reviewItem.title}</div>
              <PinyinLine pinyin={reviewItem.pinyin} tones={reviewItem.tones} show={showReviewPinyin} />
              <AudioButton
                audioSrc={reviewItem.audioUrl}
                variant="centeredBelow"
                label={`Play pronunciation for ${reviewItem.title}`}
                onPlay={() => speakMandarin(reviewItem.title, speechRate)}
              />
            </div>
            <button className="report-menu" type="button" aria-label="Report issue" onClick={() => openSheet('report')}>
              ⋯
            </button>
          </div>
          <div className="practice-side">
            <AnswerGrid
              answers={review.answers}
              correctAnswer={review.correctAnswer}
              selectedAnswer={selectedReview}
              disabled={Boolean(selectedReview)}
              onSelect={(answer) => {
                chooseReviewAnswer(answer, review.correctAnswer, review.correctFeedback, review.wrongFeedback);
                recordAnswer(reviewItem, answer === review.correctAnswer);
              }}
            />
            {feedback ? <div className={`feedback ${selectedReview === review.correctAnswer ? 'good' : 'bad'}`}>{feedback}</div> : null}
            {selectedReview ? (
              <Button
                type="button"
                onClick={() => {
                  if (!hasMoreReviewItems) {
                    completeSession(plan.minutes);
                  }

                  finishReview(hasMoreReviewItems);
                }}
              >
                {t('common.next')}
              </Button>
            ) : null}
          </div>
        </Card>
      ) : null}

      {step === 'summary' ? (
        <Card className="study-card">
          <span className="pill jade">{t('study.complete')}</span>
          <div>
            <h3>{t('study.niceWork', { number: session.sessionNumber })}</h3>
            <p>{t('study.saved')}</p>
          </div>
          <div className="summary-grid">
            <StatCard value={totalTasks} label={t('study.studied')} />
            <StatCard value={sessionAccuracy} label={t('common.accuracy')} />
            <StatCard value={session.unlocks.length} label={t('study.unlocked')} />
            <StatCard value={session.learnItems.length} label={t('study.new')} />
          </div>
          <Button type="button" onClick={() => setStep('unlocks')}>
            {t('study.viewUnlocks')}
          </Button>
        </Card>
      ) : null}

      {step === 'unlocks' ? (
        <Card className="study-card">
          <span className="pill jade">{t('study.unlocked')}</span>
          <div>
            <h3>{t('study.unlockTitle')}</h3>
            <p>{t('study.unlockCopy')}</p>
          </div>
          <div className="item-list">
            {session.unlocks.map((item) => (
              <article className="item-card" key={item.id}>
                <div className="unlock-pronunciation">
                  <h4 className="mandarin-text">{item.title}</h4>
                  <p>
                    {showLearningPinyin ? `${item.pinyin.join(' ')} · ` : ''}{item.meaning}
                  </p>
                  <AudioButton
                    audioSrc={item.audioUrl}
                    variant="centeredBelow"
                    label={`Play pronunciation for ${item.title}`}
                    onPlay={() => speakMandarin(item.title, speechRate)}
                  />
                </div>
                <em>{typeLabel(item.type, language)}</em>
              </article>
            ))}
          </div>
          <div className="session-actions">
            <Button type="button" onClick={startNextSession}>
              {t('study.another')}
            </Button>
            <Button variant="secondary" type="button" onClick={() => setScreen('home')}>
              {t('study.done')}
            </Button>
          </div>
        </Card>
      ) : null}
    </div>
  );
}

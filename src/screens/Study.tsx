import { AnswerGrid } from '../components/study/AnswerGrid';
import { StudyItemCard } from '../components/study/StudyItemCard';
import { StudyProgress } from '../components/study/StudyProgress';
import { ToneDots } from '../components/study/ToneDots';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { sessionPlans } from '../data/mockContent';
import { useAppStore } from '../stores/appStore';
import { useStudyStore } from '../stores/studyStore';

function PinyinLine({ pinyin, tones, show = true }: { pinyin: string[]; tones: number[]; show?: boolean }) {
  if (!show) {
    return null;
  }

  return (
    <>
      <div className="pinyin-line">
        {pinyin.map((syllable) => (
          <span key={syllable}>{syllable}</span>
        ))}
      </div>
      <ToneDots tones={tones} />
    </>
  );
}

export function StudyScreen() {
  const sessionSize = useAppStore((state) => state.sessionSize);
  const pinyinDisplay = useAppStore((state) => state.settings.pinyinDisplay);
  const hints = useAppStore((state) => state.settings.hints);
  const openSheet = useAppStore((state) => state.openSheet);
  const setScreen = useAppStore((state) => state.setScreen);
  const step = useStudyStore((state) => state.step);
  const selectedPractice = useStudyStore((state) => state.selectedPractice);
  const selectedReview = useStudyStore((state) => state.selectedReview);
  const feedback = useStudyStore((state) => state.feedback);
  const setStep = useStudyStore((state) => state.setStep);
  const choosePracticeAnswer = useStudyStore((state) => state.choosePracticeAnswer);
  const chooseReviewAnswer = useStudyStore((state) => state.chooseReviewAnswer);
  const finishReview = useStudyStore((state) => state.finishReview);
  const plan = sessionPlans[sessionSize];
  const showLearningPinyin = pinyinDisplay !== 'Hidden in review';
  const showReviewPinyin = pinyinDisplay === 'Always';

  return (
    <div className="study-shell">
      <StudyProgress step={step} />

      {step === 'intro' ? (
        <Card className="study-card session-intro">
          <span className="pill accent">Pack 1 · Foundations</span>
          <div>
            <h3>Today you’ll learn, practice, then review.</h3>
            <p>
              {plan.newWords} new words · {plan.reviews} reviews
              <br />
              <span className="duration-line">Duration: {plan.duration}</span>
            </p>
            <p>The app handles the order so you don’t need separate Learn and Review tabs.</p>
          </div>
          <div className="intro-stats">
            <StatCard value={plan.newWords} label="New" />
            <StatCard value={plan.reviews} label="Reviews" />
            <StatCard value={plan.duration.replace('~', '')} label="Duration" />
          </div>
          <Button type="button" onClick={() => setStep('learn')}>
            Start
          </Button>
        </Card>
      ) : null}

      {step === 'learn' ? (
        <section className="study-card desktop-wide learn-layout">
          <StudyItemCard
            type="Word"
            title="你好"
            pinyin={['nǐ', 'hǎo']}
            tones={[3, 3]}
            meaning="hello"
            showPinyin={showLearningPinyin}
          />
          <div className="study-card learn-side">
            {hints ? (
              <div className="tone-helper">
                <b>Tip</b>
                <span>Colored dots under pinyin show the tone of each syllable.</span>
              </div>
            ) : null}
            <Card className="study-info-card">
              <h3>Build the greeting</h3>
              <div className="component-grid">
                <div className="mini-box">
                  <b>你</b>
                  <small>you</small>
                </div>
                <div className="mini-box">
                  <b>好</b>
                  <small>good</small>
                </div>
                <div className="mini-box">
                  <b>吗</b>
                  <small>question</small>
                </div>
              </div>
              <p>
                <b>你好</b> means hello. Literally, it is close to “you good”.
              </p>
            </Card>
            <Card className="study-info-card">
              <h3>Example</h3>
              <p>
                <b>你好！</b>
                <br />
                Nǐ hǎo!
                <br />
                Hello!
              </p>
            </Card>
            <Button type="button" onClick={() => setStep('practice')}>
              Practice this
            </Button>
          </div>
        </section>
      ) : null}

      {step === 'practice' ? (
        <Card className="study-card practice-layout">
          <div className="review-card">
            <p className="muted">Quick practice new item</p>
            <div className="review-char">你好</div>
            <PinyinLine pinyin={['nǐ', 'hǎo']} tones={[3, 3]} show={showLearningPinyin} />
            <h3>What does this mean?</h3>
            <button className="report-menu" type="button" aria-label="Report issue" onClick={() => openSheet('report')}>
              ⋯
            </button>
          </div>
          <div className="practice-side">
            <AnswerGrid
              answers={['hello', 'thank you', 'go home', 'water']}
              correctAnswer="hello"
              selectedAnswer={selectedPractice}
              onSelect={choosePracticeAnswer}
            />
            {feedback ? <div className={`feedback ${feedback.startsWith('Correct') ? 'good' : 'bad'}`}>{feedback}</div> : null}
            {selectedPractice === 'hello' ? (
              <Button type="button" onClick={() => setStep('review')}>
                Next
              </Button>
            ) : null}
          </div>
        </Card>
      ) : null}

      {step === 'review' ? (
        <Card className="study-card practice-layout">
          <div className="review-card">
            <p className="muted">Due review</p>
            <div className="review-char">回家</div>
            <PinyinLine pinyin={['huí', 'jiā']} tones={[2, 1]} show={showReviewPinyin} />
            <h3>What does this mean?</h3>
            <button className="report-menu" type="button" aria-label="Report issue" onClick={() => openSheet('report')}>
              ⋯
            </button>
          </div>
          <div className="practice-side">
            <AnswerGrid
              answers={['drink water', 'go home', 'eat rice', 'say hello']}
              correctAnswer="go home"
              selectedAnswer={selectedReview}
              disabled={Boolean(selectedReview)}
              onSelect={chooseReviewAnswer}
            />
            {feedback ? <div className={`feedback ${feedback.startsWith('Correct') ? 'good' : 'bad'}`}>{feedback}</div> : null}
            {selectedReview ? (
              <Button type="button" onClick={finishReview}>
                Next
              </Button>
            ) : null}
          </div>
        </Card>
      ) : null}

      {step === 'summary' ? (
        <Card className="study-card">
          <span className="pill jade">Session complete</span>
          <div>
            <h3>Nice work. You’re done for today.</h3>
            <p>Your new items were saved and your reviews were refreshed.</p>
          </div>
          <div className="summary-grid">
            <StatCard value={15} label="Studied" />
            <StatCard value="87%" label="Accuracy" />
            <StatCard value={3} label="Moved up" />
            <StatCard value={1} label="Focus" />
          </div>
          <Button type="button" onClick={() => setStep('unlocks')}>
            View unlocks
          </Button>
        </Card>
      ) : null}

      {step === 'unlocks' ? (
        <Card className="study-card">
          <span className="pill jade">Unlocked</span>
          <div>
            <h3>New words and sentence practice are ready.</h3>
            <p>Because 你好 reached Familiar, related content can now appear in future sessions.</p>
          </div>
          <div className="item-list">
            <article className="item-card">
              <div>
                <h4>好吗</h4>
                <p>hǎo ma · are you okay?</p>
              </div>
              <em>Word</em>
            </article>
            <article className="item-card">
              <div>
                <h4>你好吗？</h4>
                <p>Nǐ hǎo ma? · how are you?</p>
              </div>
              <em>Sentence</em>
            </article>
          </div>
          <Button type="button" onClick={() => setScreen('home')}>
            Done
          </Button>
        </Card>
      ) : null}
    </div>
  );
}

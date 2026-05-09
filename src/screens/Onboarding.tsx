import { effectiveScript, type SessionSize } from '../data/mockContent';
import { useAppStore, type OnboardingStep } from '../stores/appStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const allSteps: OnboardingStep[] = ['welcome', 'script', 'familiarity', 'session', 'placement', 'recommend'];

function OptionCard({
  title,
  subtitle,
  selected,
  recommended = false,
  onClick,
}: {
  title: string;
  subtitle: string;
  selected: boolean;
  recommended?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`option-card${selected ? ' selected' : ''}${recommended ? ' recommended' : ''}`}
      type="button"
      onClick={onClick}
    >
      <strong>{title}</strong>
      <small>{subtitle}</small>
    </button>
  );
}

export function OnboardingScreen() {
  const onboardingStep = useAppStore((state) => state.onboardingStep);
  const scriptChoice = useAppStore((state) => state.scriptChoice);
  const familiarity = useAppStore((state) => state.familiarity);
  const sessionSize = useAppStore((state) => state.sessionSize);
  const placementAnswer = useAppStore((state) => state.placementAnswer);
  const placementScore = useAppStore((state) => state.placementScore);
  const setStep = useAppStore((state) => state.setOnboardingStep);
  const chooseScript = useAppStore((state) => state.chooseScript);
  const chooseFamiliarity = useAppStore((state) => state.chooseFamiliarity);
  const chooseSessionSize = useAppStore((state) => state.chooseSessionSize);
  const answerPlacement = useAppStore((state) => state.answerPlacement);
  const finishOnboarding = useAppStore((state) => state.finishOnboarding);

  const visibleSteps = allSteps.filter((step) => !(step === 'placement' && familiarity === 'beginner'));
  const stepIndex = Math.max(0, visibleSteps.indexOf(onboardingStep));

  return (
    <section className="onboarding">
      <div className="onboarding-card">
        <div className="progress-dots" aria-hidden="true">
          {visibleSteps.map((step, index) => (
            <i className={index <= stepIndex ? 'active' : ''} key={step} />
          ))}
        </div>

        {onboardingStep === 'welcome' ? (
          <>
            <div className="page-title">
              <h1>Mandarin!</h1>
              <p>Learn practical Mandarin in short daily sessions. Lessons, quick practice, reviews, and unlocks in one guided flow.</p>
            </div>
            <Button type="button" onClick={() => setStep('script')}>
              Get started
            </Button>
          </>
        ) : null}

        {onboardingStep === 'script' ? (
          <>
            <div className="page-title">
              <h2>Which Chinese script do you want?</h2>
              <p>You can change this later in Settings.</p>
            </div>
            <div className="option-list">
              <OptionCard
                title="Simplified"
                subtitle="Used in Mainland China, Singapore, and Malaysia."
                selected={scriptChoice === 'Simplified'}
                onClick={() => chooseScript('Simplified')}
              />
              <OptionCard
                title="Traditional"
                subtitle="Used in Taiwan, Hong Kong, and Macau."
                selected={scriptChoice === 'Traditional'}
                onClick={() => chooseScript('Traditional')}
              />
              <OptionCard
                title="Not sure"
                subtitle="We’ll start with Simplified for now."
                selected={scriptChoice === 'Not sure'}
                onClick={() => chooseScript('Not sure')}
              />
            </div>
            <div className="onboarding-actions">
              <Button variant="secondary" type="button" onClick={() => setStep('welcome')}>
                Back
              </Button>
              <Button type="button" onClick={() => setStep('familiarity')}>
                Next
              </Button>
            </div>
          </>
        ) : null}

        {onboardingStep === 'familiarity' ? (
          <>
            <div className="page-title">
              <h2>How familiar are you with Mandarin?</h2>
              <p>This helps us choose your starting point.</p>
            </div>
            <div className="option-list">
              <OptionCard
                title="Absolute beginner"
                subtitle="Start from zero."
                selected={familiarity === 'beginner'}
                onClick={() => chooseFamiliarity('beginner')}
              />
              <OptionCard
                title="I know some basics"
                subtitle="I know a few words, greetings, or simple sentences."
                selected={familiarity === 'some'}
                onClick={() => chooseFamiliarity('some')}
              />
            </div>
            <div className="onboarding-actions">
              <Button variant="secondary" type="button" onClick={() => setStep('script')}>
                Back
              </Button>
              <Button type="button" onClick={() => setStep('session')}>
                Next
              </Button>
            </div>
          </>
        ) : null}

        {onboardingStep === 'session' ? (
          <>
            <div className="page-title">
              <h2>How much do you want per session?</h2>
              <p>This controls daily session size, not a long-term goal.</p>
            </div>
            <div className="option-list">
              {(['Light', 'Standard', 'Intense'] as SessionSize[]).map((size) => (
                <OptionCard
                  key={size}
                  title={size}
                  subtitle={
                    size === 'Light'
                      ? '3 new words · ~5 min'
                      : size === 'Standard'
                        ? '5 new words · ~10 min'
                        : '8 new words · ~15 min'
                  }
                  selected={sessionSize === size}
                  recommended={size === 'Standard'}
                  onClick={() => chooseSessionSize(size)}
                />
              ))}
            </div>
            <div className="onboarding-actions">
              <Button variant="secondary" type="button" onClick={() => setStep('familiarity')}>
                Back
              </Button>
              <Button type="button" onClick={() => setStep(familiarity === 'some' ? 'placement' : 'recommend')}>
                Next
              </Button>
            </div>
          </>
        ) : null}

        {onboardingStep === 'placement' ? (
          <>
            <div className="page-title">
              <h2>Quick check</h2>
              <p>Just a few questions to avoid starting too basic.</p>
            </div>
            <Card>
              <div className="section-title">
                <div>
                  <h3>What does 你好 mean?</h3>
                  <p>Choose the closest answer.</p>
                </div>
              </div>
              <div className="answer-grid">
                {['hello', 'thank you', 'go home', 'eat rice'].map((answer) => (
                  <button
                    className={
                      placementAnswer === answer ? (answer === 'hello' ? 'correct' : 'wrong') : undefined
                    }
                    key={answer}
                    type="button"
                    onClick={() => answerPlacement(answer)}
                  >
                    {answer}
                  </button>
                ))}
              </div>
            </Card>
            <div className="onboarding-actions">
              <Button variant="secondary" type="button" onClick={() => setStep('session')}>
                Back
              </Button>
              <Button type="button" onClick={() => setStep('recommend')}>
                See recommendation
              </Button>
            </div>
          </>
        ) : null}

        {onboardingStep === 'recommend' ? (
          <>
            <div className="page-title">
              <h2>Recommended start</h2>
              <p>
                {familiarity === 'some'
                  ? 'Based on your quick check, start here and adjust later if needed.'
                  : 'We’ll start from the basics and build up gradually.'}
              </p>
            </div>
            <Card>
              <span className="pill accent">{familiarity === 'some' && placementScore > 1 ? 'Pack 2' : 'Pack 1'}</span>
              <h3>{familiarity === 'some' && placementScore > 1 ? 'Daily Basics' : 'Foundations'}</h3>
              <p>
                Script: {effectiveScript(scriptChoice)} · Intensity: {sessionSize}
              </p>
            </Card>
            <Button type="button" onClick={finishOnboarding}>
              Start learning
            </Button>
          </>
        ) : null}
      </div>
    </section>
  );
}

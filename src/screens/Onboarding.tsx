import { useState } from 'react';
import {
  effectiveScript,
  getPlacementQuestions,
  packLabelForSessionIndex,
  recommendedSessionIndexForPlacement,
  sessionPlanDescription,
  type SessionSize,
} from '../data/mockContent';
import { optionLabel } from '../i18n/copy';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore, type OnboardingStep } from '../stores/appStore';
import { useStudyStore } from '../stores/studyStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const allSteps: OnboardingStep[] = ['welcome', 'script', 'familiarity', 'session', 'placement', 'recommend', 'introChoice'];

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
  const { language, t } = useTranslation();
  const onboardingStep = useAppStore((state) => state.onboardingStep);
  const scriptChoice = useAppStore((state) => state.scriptChoice);
  const familiarity = useAppStore((state) => state.familiarity);
  const sessionSize = useAppStore((state) => state.sessionSize);
  const placementAnswers = useAppStore((state) => state.placementAnswers);
  const placementScore = useAppStore((state) => state.placementScore);
  const setStep = useAppStore((state) => state.setOnboardingStep);
  const chooseScript = useAppStore((state) => state.chooseScript);
  const chooseFamiliarity = useAppStore((state) => state.chooseFamiliarity);
  const chooseSessionSize = useAppStore((state) => state.chooseSessionSize);
  const answerPlacement = useAppStore((state) => state.answerPlacement);
  const finishOnboarding = useAppStore((state) => state.finishOnboarding);
  const setSessionIndex = useStudyStore((state) => state.setSessionIndex);
  const [placementIndex, setPlacementIndex] = useState(0);
  const placementQuestions = getPlacementQuestions(language);
  const safePlacementIndex = Math.min(placementIndex, Math.max(placementQuestions.length - 1, 0));
  const currentPlacementQuestion = placementQuestions[safePlacementIndex];
  const currentPlacementAnswer = currentPlacementQuestion ? placementAnswers[currentPlacementQuestion.id] : '';
  const isLastPlacementQuestion = safePlacementIndex >= placementQuestions.length - 1;
  const visibleSteps = allSteps.filter(
    (step) =>
      !(step === 'placement' && familiarity === 'beginner') &&
      !(step === 'introChoice' && familiarity === 'beginner'),
  );
  const stepIndex = Math.max(0, visibleSteps.indexOf(onboardingStep));
  const recommendedSessionIndex =
    familiarity === 'some' ? recommendedSessionIndexForPlacement(placementScore, placementQuestions.length) : 0;
  const recommendedLabel = packLabelForSessionIndex(recommendedSessionIndex, language);
  const recommendedPackNumber = recommendedSessionIndex + 1;
  const completeOnboarding = (startWithIntro: boolean) => {
    setSessionIndex(recommendedSessionIndex);
    finishOnboarding({
      startWithIntro,
      recommendedSessionIndex,
      introStatus: startWithIntro ? (familiarity === 'beginner' ? 'required' : 'optional') : 'skipped',
      placementTotal: familiarity === 'some' ? placementQuestions.length : 0,
    });
  };

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
              <h1>Manman!</h1>
              <p>{t('onboarding.welcomeCopy')}</p>
            </div>
            <Button type="button" onClick={() => setStep('script')}>
              {t('onboarding.getStarted')}
            </Button>
          </>
        ) : null}

        {onboardingStep === 'script' ? (
          <>
            <div className="page-title">
              <h2>{t('onboarding.scriptTitle')}</h2>
              <p>{t('onboarding.scriptSub')}</p>
            </div>
            <div className="option-list">
              <OptionCard
                title={optionLabel(language, 'Simplified')}
                subtitle={t('onboarding.simplifiedSub')}
                selected={scriptChoice === 'Simplified'}
                onClick={() => chooseScript('Simplified')}
              />
              <OptionCard
                title={optionLabel(language, 'Traditional')}
                subtitle={t('onboarding.traditionalSub')}
                selected={scriptChoice === 'Traditional'}
                onClick={() => chooseScript('Traditional')}
              />
              <OptionCard
                title={language === 'Indonesian' ? 'Belum yakin' : 'Not sure'}
                subtitle={t('onboarding.notSureSub')}
                selected={scriptChoice === 'Not sure'}
                onClick={() => chooseScript('Not sure')}
              />
            </div>
            <div className="onboarding-actions">
              <Button variant="secondary" type="button" onClick={() => setStep('welcome')}>
                {t('common.back')}
              </Button>
              <Button type="button" onClick={() => setStep('familiarity')}>
                {t('common.next')}
              </Button>
            </div>
          </>
        ) : null}

        {onboardingStep === 'familiarity' ? (
          <>
            <div className="page-title">
              <h2>{t('onboarding.familiarityTitle')}</h2>
              <p>{t('onboarding.familiaritySub')}</p>
            </div>
            <div className="option-list">
              <OptionCard
                title={t('onboarding.beginner')}
                subtitle={t('onboarding.beginnerSub')}
                selected={familiarity === 'beginner'}
                onClick={() => chooseFamiliarity('beginner')}
              />
              <OptionCard
                title={t('onboarding.some')}
                subtitle={t('onboarding.someSub')}
                selected={familiarity === 'some'}
                onClick={() => chooseFamiliarity('some')}
              />
            </div>
            <div className="onboarding-actions">
              <Button variant="secondary" type="button" onClick={() => setStep('script')}>
                {t('common.back')}
              </Button>
              <Button type="button" onClick={() => setStep('session')}>
                {t('common.next')}
              </Button>
            </div>
          </>
        ) : null}

        {onboardingStep === 'session' ? (
          <>
            <div className="page-title">
              <h2>{t('onboarding.sessionTitle')}</h2>
              <p>{t('onboarding.sessionSub')}</p>
            </div>
            <div className="option-list">
              {(['Light', 'Standard', 'Intense'] as SessionSize[]).map((size) => (
                <OptionCard
                  key={size}
                  title={optionLabel(language, size)}
                  subtitle={sessionPlanDescription(size, language)}
                  selected={sessionSize === size}
                  recommended={size === 'Standard'}
                  onClick={() => chooseSessionSize(size)}
                />
              ))}
            </div>
            <div className="onboarding-actions">
              <Button variant="secondary" type="button" onClick={() => setStep('familiarity')}>
                {t('common.back')}
              </Button>
              <Button type="button" onClick={() => setStep(familiarity === 'some' ? 'placement' : 'recommend')}>
                {t('common.next')}
              </Button>
            </div>
          </>
        ) : null}

        {onboardingStep === 'placement' ? (
          <>
            <div className="page-title">
              <h2>{t('onboarding.quickCheck')}</h2>
              <p>
                {t('onboarding.quickCheckSub')}<br />
                <span className="placement-progress">
                  {t('onboarding.questionProgress', {
                    current: safePlacementIndex + 1,
                    total: placementQuestions.length,
                  })}
                </span>
              </p>
            </div>
            {currentPlacementQuestion ? (
              <Card className="placement-question-card">
                <div className="section-title">
                  <div>
                    <h3>{currentPlacementQuestion.title}</h3>
                    <p>{currentPlacementQuestion.pinyin.join(' ')}</p>
                  </div>
                </div>
                <p>{t('onboarding.chooseClosest')}</p>
                <div className="answer-grid">
                  {currentPlacementQuestion.answers.map((answer) => {
                    const selected = currentPlacementAnswer === answer;
                    const isCorrect = selected && answer === currentPlacementQuestion.correctAnswer;

                    return (
                      <button
                        className={selected ? (isCorrect ? 'correct' : 'wrong') : undefined}
                        key={answer}
                        type="button"
                        onClick={() => answerPlacement(currentPlacementQuestion.id, answer, currentPlacementQuestion.correctAnswer)}
                      >
                        {answer}
                      </button>
                    );
                  })}
                </div>
              </Card>
            ) : null}
            <div className="onboarding-actions">
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  if (safePlacementIndex > 0) {
                    setPlacementIndex((index) => Math.max(0, index - 1));
                    return;
                  }

                  setStep('session');
                }}
              >
                {t('common.back')}
              </Button>
              <Button
                type="button"
                disabled={!currentPlacementAnswer}
                onClick={() => {
                  if (isLastPlacementQuestion) {
                    setStep('recommend');
                    return;
                  }

                  setPlacementIndex((index) => Math.min(placementQuestions.length - 1, index + 1));
                }}
              >
                {isLastPlacementQuestion ? t('onboarding.seeRecommendation') : t('common.next')}
              </Button>
            </div>
          </>
        ) : null}

        {onboardingStep === 'recommend' ? (
          <>
            <div className="page-title">
              <h2>{t('onboarding.recommendTitle')}</h2>
              <p>{familiarity === 'some' ? t('onboarding.recommendSome') : t('onboarding.recommendBeginner')}</p>
            </div>
            <Card>
              <span className="pill accent">
                {familiarity === 'beginner' ? 'Pack 000' : `Pack ${recommendedPackNumber}`}
              </span>
              <h3>{familiarity === 'beginner' ? t('onboarding.introPackTitle') : recommendedLabel}</h3>
              <p>
                {t('sheets.scriptTitle')}: {optionLabel(language, effectiveScript(scriptChoice))} ·{' '}
                {language === 'Indonesian' ? 'Sesi' : 'Session'}: {optionLabel(language, sessionSize)}
              </p>
            </Card>
            <Button type="button" onClick={() => (familiarity === 'some' ? setStep('introChoice') : completeOnboarding(true))}>
              {t('onboarding.startLearning')}
            </Button>
          </>
        ) : null}

        {onboardingStep === 'introChoice' ? (
          <>
            <div className="page-title">
              <h2>{language === 'Indonesian' ? 'Mau lihat pengenalan singkat dulu?' : 'Want a quick intro first?'}</h2>
              <p>
                {language === 'Indonesian'
                  ? 'Kami akan jelaskan cara nada, pinyin, Hanzi, dan review bekerja di Manman.'
                  : 'We’ll show you how tones, pinyin, Hanzi, and reviews work in Manman.'}
              </p>
            </div>
            <Card>
              <span className="pill accent">{recommendedLabel}</span>
              <h3>{language === 'Indonesian' ? 'Rekomendasi mulai kamu sudah siap.' : 'Your starting recommendation is ready.'}</h3>
              <p>
                {language === 'Indonesian'
                  ? 'Kamu bisa lihat pengenalan dulu, atau langsung mulai dari pack rekomendasi.'
                  : 'You can take the quick intro first, or jump straight into your recommended pack.'}
              </p>
            </Card>
            <div className="onboarding-actions">
              <Button variant="secondary" type="button" onClick={() => completeOnboarding(false)}>
                {language === 'Indonesian' ? 'Lewati dan mulai belajar' : 'Skip and start learning'}
              </Button>
              <Button type="button" onClick={() => completeOnboarding(true)}>
                {language === 'Indonesian' ? 'Ya, lihat dulu' : 'Yes, show intro'}
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}

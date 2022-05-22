import { ReactElement, ReactNode, Children, useState } from 'react'

type WizardApi = {
  toStep: (step: number) => void
}

type WizardStepProps = {
  index: number
  children: (api: WizardApi) => ReactElement
}
const Step = (_: WizardStepProps): ReactElement => null

type WizardProps = {
  children: ReactNode
}
export const Wizard = (props: WizardProps) => {
  const [currentStep, setStep] = useState(0)

  const steps = (
    Children.toArray(props.children).filter(
      child =>
        typeof child !== 'string' && (child as ReactElement).type === Step,
    ) as ReactElement<WizardStepProps>[]
  ).sort((c1, c2) => c1.props.index - c2.props.index)

  const toStep = (newStep: number) => {
    setStep(Math.min(steps.length - 1, Math.max(newStep, 0)))
  }

  return steps[currentStep].props.children({ toStep })
}

Wizard.Step = Step

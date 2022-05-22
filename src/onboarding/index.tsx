import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Greeting } from './Greeting'
import { SelectCharacter } from './SelectCharacter'
import { SetUp } from './SetUp'
import { Wizard } from './Wizard'

const WIZARD_STORAGE_KEY = 'wizard_finished'

export const Onboarding = () => {
  const navigate = useNavigate()
  const onFinished = async (id: string) => {
    window.api.load()
    localStorage.setItem(WIZARD_STORAGE_KEY, 'true')
    navigate('/characters/' + id)
  }

  useEffect(() => {
    if (localStorage.getItem(WIZARD_STORAGE_KEY)) navigate('/characters')
  }, [])

  return (
    <Wizard>
      <Wizard.Step index={0}>
        {({ toStep }) => <Greeting next={() => toStep(1)} />}
      </Wizard.Step>
      <Wizard.Step index={1}>
        {({ toStep }) => <SetUp next={() => toStep(2)} />}
      </Wizard.Step>
      <Wizard.Step index={2}>
        {() => <SelectCharacter next={onFinished} />}
      </Wizard.Step>
    </Wizard>
  )
}

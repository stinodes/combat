import { useField, useFormikContext } from 'formik'
import { ReactNode } from 'react'
import {
  Button,
  FieldProps,
  InputProps,
  TextAreaField,
  TextField,
} from 'stinodes-ui'

type FTFProps = FieldProps & InputProps & { children: ReactNode }

export const FormTextField = (props: FTFProps) => {
  const [field, meta] = useField(props.name)

  return (
    <TextField
      {...field}
      {...props}
      error={(meta.touched && meta.error) || props.error}
    />
  )
}

type FTAProps = FieldProps & InputProps & { children: ReactNode }

export const FormTextAreaField = (props: FTAProps) => {
  const [field, meta] = useField(props.name)

  return (
    <TextAreaField
      {...field}
      {...props}
      error={(meta.touched && meta.error) || props.error}
    />
  )
}

type SBProps = { children: ReactNode }

export const SubmitButton = (props: SBProps) => {
  const { isSubmitting } = useFormikContext()
  return <Button loading={isSubmitting} {...props} />
}

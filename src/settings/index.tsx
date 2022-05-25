import styled from '@emotion/styled'
import { Form, Formik } from 'formik'
import { useCallback, useEffect, useState } from 'react'
import { Button, Flex, H1, Icon, Layout, Spinner, TextField } from 'stinodes-ui'
import { FormTextAreaField, SubmitButton } from '../common/FormikFields'
import { useLoading } from '../common/useLoading'

const FlexForm = Flex.withComponent(Form)

const BottomBar = styled(Flex)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`

export const INDEXES_REGEX = /^((ftp|http|https):\/\/[^ "]+)+$/

type SettingsFormState = { path: string; resources: string; indexes: string }
export const Settings = () => {
  const [settings, setSettings] = useState<SettingsFormState>({
    path: '',
    resources: '',
    indexes: '',
  })

  const onSubmit = useCallback(async (settings: SettingsFormState) => {
    if (!INDEXES_REGEX.test(settings.indexes)) return

    await window.api.saveSettings({
      path: settings.path,
      resourceStats: settings.resources?.split('\n').map(r => {
        const [label, name] = r.split('=')
        return { label, name, color: '#FE9920' }
      }),
      indexes: settings.indexes?.split('\n'),
    })
  }, [])

  const [loading, loadSettings] = useLoading(
    useCallback(async () => {
      try {
        const settings = await window.api.settings()
        setSettings({
          path: settings.path,
          resources: settings.resourceStats
            ?.map(r => `${r.label}=${r.name}`)
            .join('\n'),
          indexes: settings.indexes.join('\n'),
        })
      } catch (e) {
        setSettings({
          path: '',
          resources: '',
          indexes: '',
        })
      }
    }, [setSettings]),
  )

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  return (
    <Flex flexDirection="column" flex={1} style={{ position: 'relative' }}>
      <Flex p={3}>
        <H1>Settings</H1>
      </Flex>
      {loading ? (
        <Flex p={3} justifyContent="center">
          <Spinner />
        </Flex>
      ) : (
        <Formik initialValues={settings} onSubmit={onSubmit}>
          {({ setFieldValue, values }) => (
            <FlexForm style={{ overflowY: 'auto' }} mb={100}>
              <Layout p={3} spacing={3} maxWidth={624} flex={1}>
                <Flex alignItems="flex-end">
                  <Flex flex={1} flexDirection="column">
                    <TextField
                      label="Resource Folder"
                      value={values.path}
                      onChange={() => {}}
                    />
                  </Flex>
                  <Button
                    onClick={async () => {
                      const path = await window.api.openDir()
                      setFieldValue('path', path)
                    }}
                  >
                    <Icon icon="folder" />
                  </Button>
                </Flex>

                <FormTextAreaField
                  name="indexes"
                  label="Index URLs"
                  style={{ height: 100 }}
                  placeholder={`Linebreak-separated indexes here.`}
                />

                <FormTextAreaField
                  name="resources"
                  label="Resource stats"
                  style={{ height: 200 }}
                  placeholder={`Ki=ki:points
Sorcery Points=sorcery points:points`}
                />
              </Layout>
              <BottomBar p={3} bg="surfaces.4">
                <SubmitButton>Save</SubmitButton>
              </BottomBar>
            </FlexForm>
          )}
        </Formik>
      )}
    </Flex>
  )
}

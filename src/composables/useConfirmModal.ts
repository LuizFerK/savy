import { reactive } from 'vue'

type ButtonVariant = 'primary' | 'secondary' | 'danger'

interface ModalButton {
  label: string
  value: unknown
  variant: ButtonVariant
}

interface ConfirmOptions {
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
}

// Singleton state: a single <ConfirmModal /> mounted at the app root reacts to
// this, so any component can trigger it without owning an instance itself.
const state = reactive<{ visible: boolean; message: string; buttons: ModalButton[]; dismissValue: unknown }>({
  visible: false,
  message: '',
  buttons: [],
  dismissValue: false
})

let resolver: ((value: unknown) => void) | null = null

function openModal(message: string, buttons: ModalButton[], dismissValue: unknown): Promise<unknown> {
  state.message = message
  state.buttons = buttons
  state.dismissValue = dismissValue
  state.visible = true

  return new Promise(resolve => {
    resolver = resolve
  })
}

function confirmModal(message: string, options: ConfirmOptions = {}): Promise<boolean> {
  const showCancel = options.showCancel ?? true
  const buttons: ModalButton[] = []
  if (showCancel) {
    buttons.push({ label: options.cancelText ?? 'Cancelar', value: false, variant: 'secondary' })
  }
  buttons.push({ label: options.confirmText ?? 'Confirmar', value: true, variant: 'primary' })

  return openModal(message, buttons, showCancel ? false : true).then(value => value === true)
}

function alertModal(message: string, confirmText = 'OK'): Promise<void> {
  return confirmModal(message, { confirmText, showCancel: false }).then(() => undefined)
}

// Generic multi-option chooser (e.g. cancel / delete-completed / delete-all).
// Each button resolves the promise with its own `value`; dismissing (clicking
// outside) resolves with `dismissValue`.
function chooseModal<T>(message: string, buttons: { label: string; value: T; variant: ButtonVariant }[], dismissValue: T | null = null): Promise<T | null> {
  return openModal(message, buttons, dismissValue) as Promise<T | null>
}

function selectButton(value: unknown) {
  state.visible = false
  resolver?.(value)
  resolver = null
}

function dismiss() {
  selectButton(state.dismissValue)
}

export function useConfirmModal() {
  return { state, confirmModal, alertModal, chooseModal, selectButton, dismiss }
}

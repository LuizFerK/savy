import { reactive } from 'vue'

interface ConfirmOptions {
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
}

// Singleton state: a single <ConfirmModal /> mounted at the app root reacts to
// this, so any component can trigger it without owning an instance itself.
const state = reactive({
  visible: false,
  message: '',
  confirmText: 'OK',
  cancelText: 'Cancelar',
  showCancel: true
})

let resolver: ((value: boolean) => void) | null = null

function confirmModal(message: string, options: ConfirmOptions = {}): Promise<boolean> {
  state.message = message
  state.confirmText = options.confirmText ?? 'Confirmar'
  state.cancelText = options.cancelText ?? 'Cancelar'
  state.showCancel = options.showCancel ?? true
  state.visible = true

  return new Promise(resolve => {
    resolver = resolve
  })
}

function alertModal(message: string, confirmText = 'OK'): Promise<void> {
  return confirmModal(message, { confirmText, showCancel: false }).then(() => undefined)
}

function handleConfirm() {
  state.visible = false
  resolver?.(true)
  resolver = null
}

function handleCancel() {
  state.visible = false
  resolver?.(false)
  resolver = null
}

export function useConfirmModal() {
  return { state, confirmModal, alertModal, handleConfirm, handleCancel }
}

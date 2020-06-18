import Vue from 'vue'
import * as authn from '@byuweb/browser-oauth'

const ms = 1000
const short = 2
const regular = Math.pow(short, 2)
const long = Math.pow(regular, 2)

function Alert (ctx, opts) {
  return {
    value: true,
    message: '',
    timeout: short,
    action: {
      fn: () => ctx.store.dispatch('root/clearAlert'),
      icon: 'mdi-close-circle',
      attrs: {
        icon: true
      }
    },
    ...opts
  }
}

function ErrorAlert(ctx, opts) {
  return Alert(ctx, {
    color: 'error',
    title: 'Error',
    timeout: long * ms,
    ...opts,
  })
}

function WarningAlert(ctx, opts) {
  return Alert(ctx, {
    color: 'warning',
    title: 'Warning',
    timeout: regular * ms,
    ...opts,
  })
}

function SuccessAlert(ctx, opts) {
  return Alert(ctx, {
    color: 'success',
    title: 'Success',
    timeout: short * ms,
    ...opts,
  })
}

function InfoAlert(ctx, opts) {
  return Alert(ctx, {
    color: 'info',
    title: 'Info',
    timeout: short * ms,
    ...opts,
  })
}

function AuthenticationAlert(ctx, opts) {
  return WarningAlert(ctx, {
    title: 'CAS Authentication Expired',
    message: 'Click this "Re-authenticate" button. ' +
        'You will log in through a separate tab and then immediately return to this page.',
    additional: 'If you were in the middle of saving data, you may have to click "Save" again.',
    timeout: 0,
    action: {
      fn: async () => {
        await authn.refresh('popup')
        await ctx.store.dispatch('root/clearAlert')
      },
      text: 'Re-authenticate',
      attrs: {
        text: true
      }
    },
    ...opts
  })
}

function AuthorizationAlert(ctx, opts) {
  return WarningAlert(ctx, {
    title: 'Unauthorized',
    message: 'The requested action is not part of your access entitlements. ' +
        'If your university employment requires you to have access to the information on this page, ' +
        'please contact your college or organization access representative.',
    ...opts
  })
}

function ConfigurationAlert(ctx, opts) {
  return ErrorAlert(ctx, {
    title: 'Page Misconfigured',
    message: 'The page you have requested is not properly configured. ' +
        'Please notify the BYU IT Support Desk at (801) 422-4000.',
    ...opts
  })
}

function alertFactory(ctx, alertFn) {
  return function raiseAlert (opts = {}) {
    return ctx.store.dispatch('root/raiseAlert', alertFn(ctx, opts))
  }
}

export default function (ctx, inject) {
  const alert = alertFactory(ctx, Alert)
  alert.error = alertFactory(ctx, ErrorAlert)
  alert.warning = alertFactory(ctx, WarningAlert)
  alert.success = alertFactory(ctx, SuccessAlert)
  alert.info = alertFactory(ctx, InfoAlert)
  alert.authentication = alertFactory(ctx, AuthenticationAlert)
  alert.authorization = alertFactory(ctx, AuthorizationAlert)
  alert.configuration = alertFactory(ctx, ConfigurationAlert)

  // Inject alerts into Vue instances
  Vue.prototype.$alert = alert

  // Inject alerts into Nuxt context
  ctx.app.$alert = alert
}

import ApiService from './ApiService'

export async function apiGetAccountSettingData<T>() {
    return ApiService.fetchData<T>({
        url: '/account/setting',
        method: 'get',
    })
}

export async function apiGetAccountSettingIntegrationData<T>() {
    return ApiService.fetchData<T>({
        url: '/account/setting/integration',
        method: 'get',
    })
}

export async function apiGetAccountSettingBillingData<T>() {
    return ApiService.fetchData<T>({
        url: '/account/setting/billing',
        method: 'get',
    })
}

export async function apiGetAccountInvoiceData<
    T,
    U extends Record<string, unknown>
>(params: U) {
    return ApiService.fetchData<T>({
        url: '/account/invoice',
        method: 'get',
        params,
    })
}

export async function apiGetAccountLogData<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/account/log',
        method: 'post',
        data,
    })
}

export async function apiGetAccountFormData<T>() {
    return ApiService.fetchData<T>({
        url: '/account/form',
        method: 'get',
    })
}

export async function apiGetNotificationsList<
    T
>() {
    return ApiService.fetchData<T>({
        url: '/notifications',
        method: 'get',
    })
}

export async function apiAddNotification<
T
>(data: any) {
    return ApiService.fetchData<T>({
        url: '/notification/send-to-user',
        method: 'post',
        data
    })
}

export async function apiAddAllUsersNotification<
T
>(data: any) {
    return ApiService.fetchData<T>({
        url: '/notification/send-to-all-users',
        method: 'post',
        data
    })
}

export async function apiAddAllSaloonssNotification<
T
>(data: any) {
    return ApiService.fetchData<T>({
        url: '/notification/send-to-allsaloon',
        method: 'post',
        data
    })
}

export async function apiDeleteNotification<
T
>(notificationId: any) {
    return ApiService.fetchData<T>({
        url: `/notification/${notificationId}`,
        method: 'delete'
    })
}
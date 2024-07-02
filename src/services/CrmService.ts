import ApiService from './ApiService'

export async function apiGetCrmDashboardData<T>() {
    return ApiService.fetchData<T>({
        url: '/crm/dashboard',
        method: 'get',
    })
}

export async function apiGetCrmCalendar<T>() {
    return ApiService.fetchData<T>({
        url: '/crm/calendar',
        method: 'get',
    })
}

export async function apiGetCrmCustomers<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/crm/customers',
        method: 'post',
        data,
    })
}

export async function apiGetCrmUsers<T>(
    data: any
) {
    return ApiService.fetchData<T>({
        url: '/saloonStaff',
        method: 'post',
        data
    })
}

export async function apiGetBookings<T>(
    data: any
) {
    return ApiService.fetchData<T>({
        url: '/saloon/booking',
        method: 'post',
        data
    })
}

export async function apiGetBookingById<T>(
    data: any
) {
    return ApiService.fetchData<T>({
        url: `/saloon/booking/${data}`,
        method: 'get',
    })
}

export async function apPutBooking<T, U extends Record<string, unknown>>(
    data: any
) {
    let bookingId = data.bookingId
    data['bookingId'] = undefined
    return ApiService.fetchData<T>({
        url: `/booking/${bookingId}`,
        method: 'put',
        data,
    })
}

export async function apiGetCrmCustomersStatistic<T>() {
    return ApiService.fetchData<T>({
        url: '/crm/customers-statistic',
        method: 'get',
    })
}

export async function apPutCrmCustomer<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/crm/customers',
        method: 'put',
        data,
    })
}

export async function apCreateCrmUser<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/saloonStaff/create',
        method: 'post',
        data,
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}

export async function apPutCrmUser<T, U extends Record<string, unknown>>(
    data: U
) {
    let id = data.updatedBy
    delete data['id']
    return ApiService.fetchData<T>({
        url: `/admin/users/${id}`,
        method: 'put',
        data,
    })
}

export async function apiGetCrmCustomerDetails<
    T,
    U extends Record<string, unknown>
>(params: U) {
    return ApiService.fetchData<T>({
        url: '/crm/customer-details',
        method: 'get',
        params,
    })
}


export async function apiDeleteCrmUser<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: `/saloonStaff/${data.deletedUserId}`,
        method: 'delete',
    })
}

export async function apiDeleteBooking<
    T
>(data: any) {
    let bookingId = data.deleteBookingId
    data['deleteBookingId'] = undefined
    return ApiService.fetchData<T>({
        url: `/booking/cancel/${bookingId}`,
        method: 'post',
        data
    })
}

export async function apiGetCrmMails<T, U extends Record<string, unknown>>(
    params: U
) {
    return ApiService.fetchData<T>({
        url: '/crm/mails',
        method: 'get',
        params,
    })
}

export async function apiGetCrmMail<T, U extends Record<string, unknown>>(
    params: U
) {
    return ApiService.fetchData<T>({
        url: '/crm/mail',
        method: 'get',
        params,
    })
}

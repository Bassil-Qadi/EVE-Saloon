import { useEffect, useState } from 'react'
import AdaptableCard from '@/components/shared/AdaptableCard'
import Loading from '@/components/shared/Loading'
import Container from '@/components/shared/Container'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import SaloonProfile from './components/SaloonProfile'
import PaymentHistory from './components/PaymentHistory'
import CategoriesTable from './components/CategoriesTable'
import ServicesTable from './components/ServicesTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
// // import CurrentSubscription from './components/CurrentSubscription'
// import PaymentMethods from './components/PaymentMethods'
import reducer, {
    useAppDispatch,
    useAppSelector,
    setSelectedSaloon,
    toggleNewCategoryDialog,
    toggleDeleteCategoryDialog,
    toggleDeleteServiceDialog,
    getSaloon,
    deleteService
} from './store'
import { useAppSelector as saloonAppSelector } from '@/views/project/ProjectList/store'
import NewProjectDialog from '../CategoryList/components/NewProjectDialog'
import NewServiceDialog from './components/NewServiceDialog'

import { injectReducer } from '@/store'
import isEmpty from 'lodash/isEmpty'
import useQuery from '@/utils/hooks/useQuery'
import { deleteCategory, getCategoryList, getSaloonServices } from '../CategoryList/store'

injectReducer('projectSaloonDetails', reducer)

const SaloonDetail = () => {
    const dispatch = useAppDispatch()
    const [saloonServices, setSaloonServices] = useState([])

    const query = useQuery()


    const currentUserId = useAppSelector(
        state => state.auth.user.id
    )
    const dialogOpen = useAppSelector(
        state => state.projectSaloonDetails.data.deleteCategoryDialog
    )
    const serviceDialogOpen = useAppSelector(
        state => state.projectSaloonDetails.data.deleteServiceDialog
    )
    const data = useAppSelector(
        (state) => state.projectSaloonDetails.data.profileData.saloon,
    )
    const saloonCategories = useAppSelector(
        (state) => state.projectSaloonDetails.data.profileData.saloonCategories,
    )
    const loading = useAppSelector(
        (state) => state.projectSaloonDetails?.data.loading,
    )
    const selectedCategory = useAppSelector(
        (state) => state.projectSaloonDetails?.data.selectedCategory,
    )
    const selectedService = useAppSelector(
        (state) => state.projectSaloonDetails?.data.selectedService,
    )

    useEffect(() => {
        fetchData()
        fetchSaloonServices()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchSaloonServices = () => {
        if (data?._id) {
            let response = dispatch(getSaloonServices({ saloonId: data._id }))
            response.then((data) => {
                if (data.payload) {
                    setSaloonServices(data.payload)
                }
            })
        }
    }

    const fetchData = () => {
        let response = dispatch(getSaloon(currentUserId))
        response.then(data => {
            if(data.payload) {
                dispatch(setSelectedSaloon(data.payload.data))
            }
        })
    }

    const onDialogClose = () => {
        dispatch(toggleDeleteCategoryDialog(false))
    }

    const onServiceDialogClose = () => {
        dispatch(toggleDeleteServiceDialog(false))
    }

    const onDeleteCategory = () => {
        let response = dispatch(deleteCategory(selectedCategory))

        response.then(data => {
            if(data.payload.responseType === 'Success') {
                dispatch(toggleDeleteCategoryDialog(false))
        toast.push(
            <Notification title={'Successfully Modified'} type="success">
                تم حذف الصنف  بنجاح
            </Notification>,
        )
            }
        })
       
    }

    const onDeleteService = () => {
        let response = dispatch(deleteService(selectedService))
        
        response.then(data => {
            if(data.payload.responseType === 'Success') {
                dispatch(toggleDeleteServiceDialog(false))
        toast.push(
            <Notification title={'Successfully Modified'} type="success">
                تم حذف الخدمة الحالة بنجاح
            </Notification>,
        )
            }
        })
    }

    return (
        <Container className="h-full">
            <Loading loading={loading}>
                {!isEmpty(data) && (
                    <div className="flex flex-col xl:flex-row gap-4">
                        <div>
                            <SaloonProfile data={data} />
                        </div>
                        <div className="w-full">
                            <AdaptableCard>
                                {/* <CurrentSubscription /> */}
                                {data?.workingTime?.length > 0 && (
                                    <PaymentHistory
                                        data={data.workingTime}
                                        userId={query.get('id')}
                                    />
                                )}
                                {saloonCategories && <CategoriesTable
                                    data={saloonCategories}
                                    userId={query.get('id')}
                                />}
                                {saloonServices && <ServicesTable
                                    data={saloonServices}
                                    userId={query.get('id')}
                                />}
                                {/* <PaymentMethods /> */}
                            </AdaptableCard>
                        </div>
                    </div>
                )}
            </Loading>
            {!loading && isEmpty(data) && (
                <div className="h-full flex flex-col items-center justify-center">
                    <DoubleSidedImage
                        src="/img/others/img-2.png"
                        darkModeSrc="/img/others/img-2-dark.png"
                        alt="No user found!"
                    />
                    <h3 className="mt-8">No user found!</h3>
                </div>
            )}
            <NewProjectDialog saloonId={data?._id} />
            <NewServiceDialog saloonCategories={saloonCategories} />
            <ConfirmDialog
                isOpen={dialogOpen}
                type="danger"
                title="حذف الصنف"
                confirmButtonColor="red-600"
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
                onCancel={onDialogClose}
                onConfirm={onDeleteCategory}
            >
                <p>
                    هل أنت متأكد أنك تريد حذف هذه الفئة؟ كل سجل سيتم حذف
                    المتعلقة بهذه الفئة أيضًا. هذا لا يمكن التراجع عن الإجراء.
                </p>
            </ConfirmDialog>
            <ConfirmDialog
                isOpen={serviceDialogOpen}
                type="danger"
                title="حذف الخدمة"
                confirmButtonColor="red-600"
                onClose={onServiceDialogClose}
                onRequestClose={onServiceDialogClose}
                onCancel={onServiceDialogClose}
                onConfirm={onDeleteService}
            >
                <p>
                    هل أنت متأكد أنك تريد حذف هذه الخدمة كل سجل سيتم حذف
                    المتعلقة بهذه الخدمة أيضًا. هذا لا يمكن التراجع عن الإجراء.
                </p>
            </ConfirmDialog>
        </Container>
    )
}

export default SaloonDetail
import { useEffect } from 'react'
import classNames from 'classnames'
import GridItem from './GridItem'
import ListItem from './ListItem'
import Spinner from '@/components/ui/Spinner'
import { getList, getSaloonsList, useAppDispatch, useAppSelector } from '../store'

const ProjectListContent = () => {
    const dispatch = useAppDispatch()

    const loading = useAppSelector((state) => state.projectList.data.loading)

    const currentUserId = useAppSelector(
        state => state.auth.user.id
    )

    const clinicsList = useAppSelector(
        (state) => state.projectList.data.saloonsList.filter(saloon => saloon.type === 'clinic' && saloon.createdBy?.id === currentUserId )
    )
    const view = useAppSelector((state) => state.projectList.data.view)
    const { sort, search } = useAppSelector(
        (state) => state.projectList.data.query
    )

    useEffect(() => {
        dispatch(getList({ sort, search }))
        dispatch(getSaloonsList())
    }, [dispatch, sort, search])

    return (
        <div
            className={classNames(
                'mt-6 h-full flex flex-col',
                loading && 'justify-center'
            )}
        >
            {loading && (
                <div className="flex justify-center">
                    <Spinner size={40} />
                </div>
            )}
            {view === 'grid' && clinicsList.length > 0 && !loading && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {clinicsList?.filter(clinic => clinic.name.toLocaleLowerCase()?.startsWith(search))?.map((clinic) => (
                        <GridItem key={clinic._id} data={clinic} />
                    ))}
                </div>
            )}
            {view === 'list' &&
                clinicsList.length > 0 &&
                !loading &&
                clinicsList?.filter(clinic => clinic.name.toLocaleLowerCase()?.startsWith(search))?.map((clinic) => (
                    <ListItem key={clinic._id} data={clinic} />
                ))}
        </div>
    )
}

export default ProjectListContent

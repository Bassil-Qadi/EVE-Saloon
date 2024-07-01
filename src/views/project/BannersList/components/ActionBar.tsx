import { useRef, useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Tooltip from '@/components/ui/Tooltip'
import CustomerTableFilter from '@/views/crm/Customers/components/CustomerTableFilter'
import {
    HiOutlinePlusCircle,
    HiOutlineSearch,
    HiOutlineViewGrid,
    HiOutlineViewList,
    HiOutlineSortAscending,
    HiOutlineSortDescending,
} from 'react-icons/hi'
import {
    toggleView,
    toggleSort,
    setSearch,
    toggleNewBannerDialog,
    useAppDispatch,
    useAppSelector,
} from '../store'

// import { getSaloonsList } from '../../ProjectList/store'

import debounce from 'lodash/debounce'
import type { ChangeEvent } from 'react'

const ActionBar = () => {
    const dispatch = useAppDispatch()

    const inputRef = useRef(null)
    // const [saloonsList, setSaloonsList] = useState([])

    const view = useAppSelector((state) => state.bannersList.data.view)

    const { sort } = useAppSelector((state) => state.bannersList.data.query)

    // useEffect(() => {
    //     let response = dispatch(getSaloonsList())
    //     response.then(data => {
    //         console.log(data.payload)
    //         if(data.payload.responseType === 'Success') {
    //             let newSaloonsList = data?.payload?.map((saloon: any) => {
    //                 return {
    //                     ...saloon,
    //                     label: saloon.name,
    //                     value: saloon._id
    //                 }
    //             })

    //             setSaloonsList(newSaloonsList)
    //         }
    //     })
    // }, [])

    const onViewToggle = () => {
        dispatch(toggleView(view === 'grid' ? 'list' : 'grid'))
    }

    const onToggleSort = () => {
        dispatch(toggleSort(sort === 'asc' ? 'desc' : 'asc'))
    }

    const onAddNewProject = () => {
        dispatch(toggleNewBannerDialog(true))
    }

    const debounceFn = debounce(handleDebounceFn, 500)

    function handleDebounceFn(val: string) {
        dispatch(setSearch(val))
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        debounceFn(e.target.value)
    }

    return (
        <div className="lg:flex items-center justify-between mb-4">
            <h3 className="mb-4 lg:mb-0">قائمة العروض</h3>
            <div className="flex flex-col md:flex-row md:items-center gap-1">
                <CustomerTableFilter />
                <Input
                    ref={inputRef}
                    size="sm"
                    placeholder="بحث"
                    prefix={<HiOutlineSearch className="text-lg" />}
                    onChange={handleInputChange}
                    className='mb-4'
                />
                {/* <Tooltip title={view === 'grid' ? 'List view' : 'Grid view'} className='mb-4'>
                    <Button
                        className="hidden md:flex"
                        variant="plain"
                        size="sm"
                        icon={
                            view === 'grid' ? (
                                <HiOutlineViewList />
                            ) : (
                                <HiOutlineViewGrid />
                            )
                        }
                        onClick={() => onViewToggle()}
                    />
                </Tooltip>
                <Tooltip title={`Sort: ${sort === 'asc' ? 'A-Z' : 'Z-A'}`} className='mb-4'>
                    <Button
                        className="hidden md:flex"
                        variant="plain"
                        size="sm"
                        icon={
                            sort === 'asc' ? (
                                <HiOutlineSortAscending />
                            ) : (
                                <HiOutlineSortDescending />
                            )
                        }
                        onClick={onToggleSort}
                    />
                </Tooltip> */}
                <Button
                    size="sm"
                    variant="twoTone"
                    icon={<HiOutlinePlusCircle />}
                    onClick={onAddNewProject}
                    className='mb-4'
                >
                    عرض جديد
                </Button>
            </div>
        </div>
    )
}

export default ActionBar

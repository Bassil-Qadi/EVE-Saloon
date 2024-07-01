import { useState, useEffect } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Upload from '@/components/ui/Upload'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import {
    Field,
    FieldArray,
    Form,
    Formik,
    FieldProps,
    ErrorMessage,
} from 'formik'
import { FcImageFile } from 'react-icons/fc'
import {
    useAppDispatch,
    useAppSelector,
    toggleNewProjectDialog,
    addSaloon,
    getSaloonsList,
} from '../store'

import { getAllCategoryList } from '../../CategoryList/store'

import * as Yup from 'yup'

type FormModel = {
    name: string
    description: string
    categories: string[]
    phone: string
    address: {
        value: string
    }
    images: string[]
    workingTime: []
    file: string
}

type Category = {
    name?: string
    label?: string
}

const saudiArabiaStates = [
    { label: 'الرياض', value: 'Riyadh' },
    { label: 'مكة', value: 'Makkah' },
    { label: 'المدينة المنورة', value: 'Madinah' },
    { label: 'المنطقة الشرقية', value: 'Eastern Province' },
    { label: 'القصيم', value: 'Qassim' },
    { label: 'حائل', value: 'Hail' },
    { label: 'تبوك', value: 'Tabuk' },
    { label: 'الجوف', value: 'Al-Jouf' },
    { label: 'عسير', value: 'Asir' },
    { label: 'جازان', value: 'Jazan' },
    { label: 'نجران', value: 'Najran' },
    { label: 'الباحة', value: 'Bahah' },
    { label: 'الحدود الشمالية', value: 'Northern Borders' },
]

const validationSchema = Yup.object().shape({
    name: Yup.string().min(3, 'Too Short!').required('الرجاء إدحال الاسم'),
    description: Yup.string().required('الرجاء إدخال التفاصيل'),
})

const NewProjectForm = () => {
    const dispatch = useAppDispatch()

    const currentUserId = useAppSelector((state) => state.auth.user.id)

    const [categories, setCategories] = useState([])

    const onSubmit = (
        formValue: FormModel,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => {
        setSubmitting(true)

        const formData = new FormData()
        const { name, description, categories, address, file, images, phone, workingTime } =
            formValue

        let newCategories = categories.map((category: any) => category._id)

        formData.append('name', name)
        formData.append('discription', description)
        formData.append('createdBy', currentUserId || '')
        formData.append('categories', JSON.stringify(newCategories))
        formData.append('workingTime', JSON.stringify(workingTime))
        formData.append('location[type]', 'Point')
        formData.append('location[coordinates][]', '39.19057020516831')
        formData.append('location[coordinates][]', '21.53677989904675')
        formData.append('address', address?.value)
        formData.append('type', 'saloon')
        formData.append('logo', file)
        formData.append('phone', phone)

        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i])
        }

        dispatch(toggleNewProjectDialog(false))
        let responseData = dispatch(addSaloon(formData))
        responseData.then((data) => {
            if (data.payload.statusCode === 201) {
                toast.push(
                    <Notification title={'Successfully Added'} type="success">
                        تم إضافة الصالون بنجاح
                    </Notification>,
                )
                dispatch(getSaloonsList())
            }
        })
    }

    useEffect(() => {
        let responseData = dispatch(getAllCategoryList())
        responseData.then((data) => {
            const updatedCategories = data.payload.map((cat: Category) => {
                return {
                    ...cat,
                    label: cat.name,
                    value: cat.name,
                }
            })
            setCategories(updatedCategories)
        })
    }, [])

    return (
        <Formik
            initialValues={{
                name: '',
                description: '',
                categories: [],
                phone: '',
                address: {
                    value: '',
                },
                // workingTime: [],
                images: [],
                file: '',
                workingTime: [
                    { day: 'السبت', open: '', close: '', selected: false },
                    { day: 'الأحد', open: '', close: '', selected: false },
                    { day: 'الاثنين', open: '', close: '', selected: false },
                    { day: 'الثلاثاء', open: '', close: '', selected: false },
                    { day: 'الأربعاء', open: '', close: '', selected: false },
                    { day: 'الخميس', open: '', close: '', selected: false },
                    { day: 'الجمعة', open: '', close: '', selected: false },
                ],
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                onSubmit(values, setSubmitting)
            }}
        >
            {({ touched, errors, values }) => (
                <Form>
                    <FormContainer>
                        <FormItem
                            label="الاسم"
                            invalid={errors.name && touched.name}
                            errorMessage={errors.name}
                        >
                            <Field
                                type="text"
                                autoComplete="off"
                                name="name"
                                placeholder="ادخل اسم الصالون"
                                component={Input}
                            />
                        </FormItem>
                        <FormItem
                            label="التفاصيل"
                            invalid={errors.description && touched.description}
                            errorMessage={errors.description}
                        >
                            <Field
                                textArea
                                type="text"
                                autoComplete="off"
                                name="description"
                                placeholder="ادخل تفاصيل الصالون"
                                component={Input}
                            />
                        </FormItem>
                        <FormItem
                            label="رقم الجوال"
                            invalid={errors.phone && touched.phone}
                            errorMessage={errors.phone}
                        >
                            <Field
                                type="text"
                                autoComplete="off"
                                name="phone"
                                placeholder="ادخل رقم الجوال"
                                component={Input}
                            />
                        </FormItem>
                        <FormItem label="الأصناف">
                            <Field name="categories">
                                {({ field, form }: FieldProps) => {
                                    return (
                                        <Select
                                            isMulti
                                            placeholder="اختر الأصناف"
                                            options={categories}
                                            onChange={(options) =>
                                                form.setFieldValue(
                                                    field.name,
                                                    options,
                                                )
                                            }
                                        />
                                    )
                                }}
                            </Field>
                        </FormItem>
                        <FormItem
                            label="العنوان"
                            invalid={
                                errors.address?.value && touched.address?.value
                            }
                            errorMessage={errors.address?.value}
                        >
                            <Field name="address">
                                {({ field, form }: FieldProps) => {
                                    return (
                                        <Select
                                            placeholder="اختر المنطقة"
                                            defaultValue={saudiArabiaStates[0]}
                                            options={saudiArabiaStates}
                                            onChange={(options) =>
                                                form.setFieldValue(
                                                    field.name,
                                                    options,
                                                )
                                            }
                                        />
                                    )
                                }}
                            </Field>
                        </FormItem>
                        <FormItem label='أوقات العمل'>
                        <FieldArray name="workingTime">
                            {() => (
                                <div>
                                    {values.workingTime.map((time, index) => (
                                        <div
                                            key={time.day}
                                            style={{ marginLeft: '10px' }}
                                        >
                                            <label>
                                                <Field
                                                    type="checkbox"
                                                    name={`workingTime.${index}.selected`}
                                                />
                                                {time.day}
                                            </label>
                                            {values.workingTime[index]
                                                .selected && (
                                                <div>
                                                    <Field
                                                        type="time"
                                                        name={`workingTime.${index}.open`}
                                                        placeholder="Open Time"
                                                    />
                                                    <ErrorMessage
                                                        name={`workingTime.${index}.open`}
                                                        component="div"
                                                        style={{ color: 'red' }}
                                                    />
                                                    <Field
                                                        type="time"
                                                        name={`workingTime.${index}.close`}
                                                        placeholder="Close Time"
                                                    />
                                                    <ErrorMessage
                                                        name={`workingTime.${index}.close`}
                                                        component="div"
                                                        style={{ color: 'red' }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </FieldArray>
                        </FormItem>
                        {/* <FormItem label='أوقات العمل'>
                            <Field name="workingTime">
                                {({ field, form }: FieldProps) => {
                                    return <div>
                                    <Checkbox.Group
                                        vertical
                                        value={checkboxList}
                                        onChange={onCheckboxChange}
                                    >
                                        <Checkbox value="Selection A">
                                            Selection A{' '}
                                        </Checkbox>
                                        <Checkbox value="Selection B">
                                            Selection B{' '}
                                        </Checkbox>
                                        <Checkbox value="Selection C">
                                            Selection C{' '}
                                        </Checkbox>
                                    </Checkbox.Group>
                                </div>
                                }}
                            </Field>
                        </FormItem> */}
                        <FormItem
                            label="شعار الصالون"
                            invalid={errors.file && touched.file}
                            errorMessage={errors.file}
                        >
                            <Field name="file">
                                {({ field, form }: FieldProps) => {
                                    return (
                                        <div>
                                            <Upload
                                                draggable
                                                uploadLimit={1}
                                                onChange={(files) => {
                                                    form.setFieldValue(
                                                        field.name,
                                                        files[0],
                                                    )
                                                }}
                                            >
                                                <div className="my-10 text-center">
                                                    <div className="text-6xl mb-4 flex justify-center">
                                                        <FcImageFile />
                                                    </div>
                                                    <p className="font-semibold">
                                                        <span className="text-gray-800 dark:text-white">
                                                            Drop your image
                                                            here, or{' '}
                                                        </span>
                                                        <span className="text-blue-500">
                                                            browse
                                                        </span>
                                                    </p>
                                                    <p className="mt-1 opacity-60 dark:text-white">
                                                        Support: jpeg, png, gif
                                                    </p>
                                                </div>
                                            </Upload>
                                        </div>
                                    )
                                }}
                            </Field>
                        </FormItem>
                        <FormItem label="صور الصالون">
                            <Field name="images">
                                {({ field, form }: FieldProps) => {
                                    return (
                                        <div>
                                            <Upload
                                                draggable
                                                onChange={(files) => {
                                                    form.setFieldValue(
                                                        field.name,
                                                        files,
                                                    )
                                                }}
                                            >
                                                <div className="my-10 text-center">
                                                    <div className="text-6xl mb-4 flex justify-center">
                                                        <FcImageFile />
                                                    </div>
                                                    <p className="font-semibold">
                                                        <span className="text-gray-800 dark:text-white">
                                                            Drop your image
                                                            here, or{' '}
                                                        </span>
                                                        <span className="text-blue-500">
                                                            browse
                                                        </span>
                                                    </p>
                                                    <p className="mt-1 opacity-60 dark:text-white">
                                                        Support: jpeg, png, gif
                                                    </p>
                                                </div>
                                            </Upload>
                                        </div>
                                    )
                                }}
                            </Field>
                        </FormItem>
                        <Button block variant="solid" type="submit">
                            إرسال
                        </Button>
                    </FormContainer>
                </Form>
            )}
        </Formik>
    )
}

export default NewProjectForm

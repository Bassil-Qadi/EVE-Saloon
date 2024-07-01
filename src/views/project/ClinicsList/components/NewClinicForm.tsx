import { useState, useEffect } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import Select from '@/components/ui/Select'
import Upload from '@/components/ui/Upload'
import { Field, Form, Formik, FieldProps } from 'formik'
import { FcImageFile } from 'react-icons/fc'
import {
    useAppDispatch,
    useAppSelector,
    toggleNewProjectDialog,
    addSaloon,
    getSaloonsList,
} from '../store'

import { getCategoryList } from '../../CategoryList/store'

import * as Yup from 'yup'

type FormModel = {
    name: string
    description: string
    categories: string[]
    address: string
    images: string[]
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
        const { name, description, categories, address, file, images } =
            formValue

        let newCategories = categories.map((category) => category._id)

        formData.append('name', name)
        formData.append('about', description)
        formData.append('createdBy', currentUserId || '')
        formData.append('categories', JSON.stringify(newCategories))
        formData.append('location[type]', 'Point')
        formData.append("location[coordinates][]", "39.19057020516831");
        formData.append("location[coordinates][]", "21.53677989904675");
        formData.append('address', address?.value)
        formData.append('type', 'clinic')
        formData.append('logo', file)
        formData.append('phone', '12345678908')

        for(let i = 0; i < images.length; i++) {
            formData.append("images", images[i])
        }

        dispatch(toggleNewProjectDialog(false))
        let responseData = dispatch(addSaloon(formData))
        responseData.then(data => {
            if(data.payload.statusCode === 201) {
                toast.push(
                    <Notification title={'Successfully Added'} type="success">
                        تم إضافة العيادة بنجاح
                    </Notification>
                )
                dispatch(getSaloonsList())
            }
        })
    }

    useEffect(() => {
        let responseData = dispatch(getCategoryList())
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
                address: '',
                images: [],
                file: '',
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
                                placeholder="ادخل اسم العيادة"
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
                                placeholder="ادخل تفاصيل العيادة"
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
                            invalid={errors.address && touched.address}
                            errorMessage={errors.address}
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
                        <FormItem
                            label="شعار العيادة"
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
                                                onChange={(files) =>{
                                                    form.setFieldValue(
                                                        field.name,
                                                        files[0]
                                                )
                                            }
                                                }
                                                
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
                        <FormItem label="صور العيادة">
                            <Field name="images">
                                {({ field, form }: FieldProps) => {
                                    return (
                                        <div>
                                            <Upload
                                                draggable
                                                onChange={(files) => {
                                                    form.setFieldValue(
                                                        field.name,
                                                        files
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

import { useState, useEffect } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { Field, Form, Formik, FieldProps } from 'formik'
import { getSaloonsList } from '../../ProjectList/store'
import {
    useAppDispatch,
    useAppSelector,
    toggleNewServiceDialog,
    addService
} from '../store'
import * as Yup from 'yup'

type FormModel = {
    name: string
    price: string
    duration: string
    saloon: string
    saloonCategory: string
}

const NewServiceForm = ({ saloonCategories }: any) => {
    const dispatch = useAppDispatch()

    const [saloonsList, setSaloonsList] = useState([])
    const [saloonCategoriesList, setSaloonCategoriresList] = useState([])
    const currentUserId = useAppSelector((state) => state.auth.user.id)

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('الرجاء إدحال الاسم'),
        price: Yup.string().required('الرجاء إدحال السعر'),
        duration: Yup.string().required('الرجاء إدحال المدة'),
        saloonCategory: Yup.string().required('الرجاء اختيار الصنف').oneOf(saloonCategoriesList.map((option: any) => option.value), 'Invalid option selected'),
    })

    useEffect(() => {
        fetchSaloonsList()
    }, [])

    const fetchSaloonsList = async () => {
        let response = dispatch(getSaloonsList())
        response.then((data) => {
            const updatedSaloons = data.payload
                .filter(
                    (saloon: any) => saloon?.createdBy?.id === currentUserId,
                )
                .map((saloon: any) => {
                    return {
                        ...saloon,
                        label: saloon.name,
                        value: saloon.name,
                    }
                })
            setSaloonsList(updatedSaloons)
        })
        let newSaloonCategories = saloonCategories.map((cat: any) => {
            return {
                ...cat,
                label: cat.name,
                value: cat._id
            }
        })
        setSaloonCategoriresList(newSaloonCategories)
    }

    const onSubmit = (
        formValue: FormModel,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => {
        setSubmitting(true)

        const { name, price, duration, saloon, saloonCategory } = formValue

        dispatch(addService({ name, price, duration, saloonCategoryId: saloonCategory, userId: currentUserId, saloonId: saloon._id }))
        dispatch(toggleNewServiceDialog(false))
        // dispatch(getCategoryList({ saloonId: saloon._id }))
    }

    return (
        <Formik
            initialValues={{
                name: '',
                price: '',
                duration: '',
                saloon: '',
                saloonCategory: '',
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
                                placeholder="ادخل اسم الخدمة"
                                component={Input}
                            />
                        </FormItem>
                        <FormItem
                            label="السعر"
                            invalid={errors.price && touched.price}
                            errorMessage={errors.price}
                        >
                            <Field
                                type="text"
                                autoComplete="off"
                                name="price"
                                placeholder="ادخل سعر الخدمة"
                                component={Input}
                            />
                        </FormItem>
                        <FormItem
                            label="المدة"
                            invalid={errors.duration && touched.duration}
                            errorMessage={errors.duration}
                        >
                            <Field
                                type="text"
                                autoComplete="off"
                                name="duration"
                                placeholder="ادخل مدة الخدمة"
                                component={Input}
                            />
                        </FormItem>
                        <FormItem
                            label="قائمة الصالونات"
                            invalid={errors.saloon && touched.saloon}
                            errorMessage={errors.saloon}
                        >
                            <Field name="saloon">
                                {({ field, form }: FieldProps) => {
                                    return (
                                        <Select
                                            placeholder="اختر الصالون"
                                            options={saloonsList}
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
                            label="قائمة الأصناف"
                            invalid={errors.saloonCategory && touched.saloonCategory}
                            errorMessage={errors.saloonCategory}
                        >
                            <Field name="saloonCategory">
                                {({ field, form }: FieldProps) => {
                                    return (
                                        <Select
                                            placeholder="اختر الصنف المراد إضافة الخدمة له"
                                            options={saloonCategoriesList}
                                            onChange={(options: any) =>
                                                {
                                                    console.log(options)
                                                    form.setFieldValue(
                                                        field.name,
                                                        options._id,
                                                    )
                                                }
                                            }
                                        />
                                    )
                                }}
                            </Field>
                        </FormItem>
                        <Button block variant="solid" type="submit">
                            إضافة
                        </Button>
                    </FormContainer>
                </Form>
            )}
        </Formik>
    )
}

export default NewServiceForm
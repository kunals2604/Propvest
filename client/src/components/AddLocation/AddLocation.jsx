import React from 'react'
import { useForm } from '@mantine/form'
import { validateString } from '../../utils/common'
import useCountries from '../../hooks/useCountries';
import { Button, Group, Select, TextInput } from '@mantine/core';
import Map from '../Map/Map';

const AddLocation = ({ propertyDetails, setPropertyDetails,nextStep}) => {
    const { getAll } = useCountries();
    const form = useForm({
        initialValues: {
            country: propertyDetails?.country,
            city: propertyDetails?.city,
            address: propertyDetails?.address,
        },
        validate: {
            country: (value) => validateString(value),
            city: (value) => validateString(value),
            address: (value) => validateString(value),


        }

    })
    const { country, city, address } = form.values;
    const handleSubmit= ()=>{
        
        const {hasErrors}= form.validate();
        if(!hasErrors){
            console.log("gg")
            setPropertyDetails((prev)=> ({...prev,city,address,country}))
            nextStep();
        }
    }

    return (
        <form
        onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
        }}

        >

            <div className="flexCenter"
                style={{
                    justifyContent: "space-between",
                    gap: "3rem",
                    marginTop: "3rem",
                }}>





                {/*left*/}
                {/*inputs*/}
                <div className="flexColStart">
                    <Select
                        w={"100%"}
                        withAsterisk
                        label="Country"
                        clearable
                        searchable
                        data={getAll()}
                        {
                        ...form.getInputProps("country", { type: "input" })

                        }
                    />
                    <TextInput
                        w={"100%"}
                        withAsterisk
                        label="City"
                        {...form.getInputProps("city", { type: "input" })}
                    />
                    <TextInput
                        w={"100%"}
                        withAsterisk
                        label="Address"
                        {...form.getInputProps("address", { type: "input" })}
                    />
                </div>


                <div style={{ flex: 1 }}>
                    <Map
                        address={address}
                        city={city}
                        country={country}
                    />
                </div>
            </div>
            <Group position="center" mt="xl">
                <Button type="submit"> Next Step</Button>

            </Group>


        </form>
    )
}

export default AddLocation
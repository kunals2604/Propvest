import React, { useContext, useState } from 'react'
import { use } from 'react'
import { useLocation } from 'react-router-dom'
import { useMutation, useQuery } from 'react-query'
import { getProperty, removeBooking } from '../../utils/api'
import { AiFillHeart, AiTwotoneCar } from 'react-icons/ai'
import PuffLoader from 'react-spinners/PuffLoader'
import './Property.css'
import { FaShower } from 'react-icons/fa'
import { MdMeetingRoom } from 'react-icons/md'
import { MdLocationPin } from 'react-icons/md'
import Map from '../../components/Map/Map'
import useAuthCheck from '../../hooks/useAuthCheck'
import { useAuth0 } from '@auth0/auth0-react'
import BookingModal from '../../components/BookingModal/BookingModal'
import UserDetailContext from '../../context/UserDetailContext'
import { Button } from '@mantine/core'
import { toast } from 'react-toastify'
import Heart from '../../components/Heart/Heart'


const Property = () => {
    const { pathname } = useLocation()
    const id = pathname.split("/").slice(-1)[0]

    const { data, isLoading, isError } = useQuery(["resd", id], () => getProperty(id))
    const [modalOpened, setModalOpened] = useState(false)
    const { validateLogin } = useAuthCheck()
    const { user } = useAuth0();

    const { userDetails: { token, bookings }, setUserDetails } = useContext(UserDetailContext)

    
    
    const{mutate :cancelBooking,isLoading :cancelling}=useMutation({
        mutationFn :()=>removeBooking(id,user?.email,token),
        onSuccess:()=>{
            setUserDetails((prev)=> ({
                ...prev,
                bookings: prev.bookings.filter((booking) => booking.id !== id)
            }))
            toast.success("Booking cancelled", { position: "bottom-right" });
        }
    })


    if (isLoading) {
        return <div className="wrapper">
            <div className="flexCenter paddings">
                <PuffLoader />
            </div>
        </div>
    }
    if (isError) {
        return <div className="wrapper">
            <div className="flexCenter paddings">
                <span>Error loading property</span>
            </div>
        </div>
    }
    return (
        <div className="wrapper">
            <div className="flexColStart paddings innerwidth property-container">
                <div className="like">
                    <Heart id={id} />
                </div>
                <img src={data?.image} alt="home image" />
                <div className="flexCenter property-details">
                    {/*left side*/}
                    <div className="flexColStart left">
                        {/*head*/}
                        <div className="flexStart head">
                            <span className="primaryText">{data?.title}  </span>
                            <span className="orangeText" style={{ fontSize: '1.5rem' }}>${data.price}</span>
                        </div>
                        {/*facilities*/}
                        <div className="flexStart facilities">
                            {/*bathrooms*/}
                            <div className="flexStart facility">
                                <FaShower size={20} color="#1F3E72" />
                                <span>{data?.facilities?.bathrooms} Bathrooms</span>
                            </div>
                            {/*parking*/}
                            <div className="flexStart facility">
                                <AiTwotoneCar size={20} color="#1F3E72" />
                                <span>{data?.facilities?.parkings} Parking</span>
                            </div>
                            {/*bedrooms*/}
                            <div className="flexStart facility">
                                <MdMeetingRoom size={20} color="#1F3E72" />
                                <span>{data?.facilities?.bedrooms} Room</span>
                            </div>
                        </div>
                        {/*description*/}
                        <span className="secondaryText " style={{ textAlign: "justify" }}>{data?.description}</span>
                        {/*address*/}
                        <div className="flexStart" style={{ gap: "1rem" }}>
                            <MdLocationPin size={25} />
                            <span className="secondaryText">
                                {data?.address}{" "}
                                {data?.city}{" "}
                                {data?.country}
                            </span>
                        </div>
                        {/*booking button*/}
                        {
                            bookings?.map((booking) => booking.id).includes(id) ? (
                                <>
                                <Button variant="outline" w={"100%"} color="red" onClick={()=>cancelBooking()} diabled={cancelling}>
                                    <span>Cancel Booking</span>
                                </Button>
                                <span>
                                    Your visit already booked for date {bookings?.filter((booking)=>booking?.id===id)[0].date}
                                </span>
                                </>
                            ) : (
                                < button className="button" onClick={() => { validateLogin() && setModalOpened(true) }}>
                                    Book Your Visit
                                </button>
                            )}
                        {/*modal*/}   
                        <BookingModal     
                            opened={modalOpened}
                            setOpened={setModalOpened}
                            propertyId={id}
                            email={user?.email}
                        />






                    </div>
                    {/*right side*/}
                    <div className="map">
                        <Map address={data?.address}
                            city={data?.city}
                            country={data?.country} />


                    </div>



                </div>


            </div>

        </div >

    );
};

export default Property;
import { useEffect, useState } from "react";
import styles from "./packageEdit.module.css";
import PackageCard from "@/components/cards/packageCard/packageCard";
import { getAllVendorsList, getPackageVendor, getVendorFromPackageId, handleNewVendor, handleVendorDelete } from "@/services/vendor";
import { RiDeleteBin5Fill } from "react-icons/ri"
import { addNewPackage, updatePackageData } from "@/services/updateData";
import { BsCheck } from "react-icons/bs"
import Toast from "@/components/notification/toast";
import FlightsTable from "@/components/flights/table/flightsTable";
import { uploadImageToFirebase } from "@/services/storage";
import Image from "next/image";
import ImageGallery from "@/components/image-gallary/image-gallary";
const PackageEditForm = ({ details, packageid }) => {
    const [vendors, setVendors] = useState([])
    const [allVendors, setAllVendors] = useState([])
    const [newVendor, setNewVendors] = useState([])
    const [toastMessage, setToastMessage] = useState({ msg: "" });
    const [newSelectedVendor, setNewSelectedVendor] = useState({ title: "" });
    const [newFlight, setNewFlight] = useState({})
    const [newDetails, setNewDetails] = useState({
        title: "",
        price: "",
        order: "",
        category: "",
        hotels: [],
        features: [
            "All Meals and Laudary",
            "Air Ticket and Visa",
            "Hotel 4/5 Bed Sharing",
            "Insurance and Ziyarat",
            "Round Trip Transport",
            "Flight by Saudi Air"
        ],
        isBold: [
            false,
            false,
            false,
            false,
            false,
            false
        ],
        date: "",
        maulana: {
            name: "",
            details: "",
            image: "",
            position: "top"
        }
    })
    const [imageUrl, setImageUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [gallary, setOpenGallary] = useState(false)

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const url = await uploadImageToFirebase(file);
            setImageUrl(url);
            alert("Upload successful!");
        } catch (error) {
            console.error("Upload error:", error);
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        setNewDetails(details);

        getVendor();
    }, [details])

    const getVendor = async () => {
        setAllVendors(await getAllVendorsList())
        setVendors(await getPackageVendor(details.id))
    }

    const onClose = () => {
        setToastMessage({ msg: "" })
    }

    const updateVendor = async () => {
        let newVendorsIds = []
        newVendor.forEach(v => {
            newVendorsIds.push(v.id)
        })
        if (newSelectedVendor.title) {
            newVendorsIds.push(newSelectedVendor.id);
        }

        return await handleNewVendor(newVendorsIds, { id: details.id, title: details.title })
    }

    const handleSubmit = async (data) => {
        let msg = { msg: "something" };
        if (!data) {
            updateVendor()
        }



        if (newDetails.id) {
            msg = await updatePackageData(newDetails, packageid)
        } else {
            msg = await addNewPackage(newDetails, packageid)
        }

        setToastMessage(msg);

    }

    useEffect(() => {
        setNewSelectedVendor({ title: "" });
    }, [newVendor])

    useEffect(() => {

        if (packageid == 'iraq' && !details.id) {
            setNewDetails({ ...details, type: "something" })
        }
        if (details.id) {
            setNewDetails({ ...details })
        }
    }, [details, packageid])


    const delteFlight = (targetId) => {

        let newFlights = newDetails.flights.filter((f, i) => {
            return i != targetId;
        });
        setNewDetails({ ...newDetails, flights: [...newFlights] })
    }

    useEffect(() => {
        if (imageUrl != null) {
            setNewDetails({
                ...newDetails,
                maulana: {
                    ...newDetails.maulana,
                    image: imageUrl
                }
            })
        }

    }, [imageUrl])


    useEffect(() => {
        console.log("image updated")
        console.log("url ", imageUrl)
        console.log("details", newDetails.maulana)
    }, [imageUrl, newDetails.maulana])

    const setImageURLforImage = (path, url) => {
        setImageUrl(url)
    }

    const GallaryModel = (<div className={styles.modelWrapper}>
        <div className={styles.modelWrapperInner}>
            <div className={styles.modelClose} onClick={() => { setOpenGallary(false) }}>Close</div>
            <div className={styles.modelBody}>
                <ImageGallery onClick={setImageURLforImage} btnText={"Select Image"} btnType={"info"} />
            </div>
        </div>
    </div>)


    return (
        <div>
            <div className="body-wrapper">
                {
                    gallary && GallaryModel
                }
                {toastMessage.msg && <Toast onClose={onClose} type={toastMessage.status} message={toastMessage.msg} />}
                <div className={styles.wrapper}>
                    <form>
                        <div className={styles.formItem}>
                            <label className={styles.label} htmlFor="title">PackageTitle</label>
                            <input onChange={(e) => { setNewDetails({ ...newDetails, title: e.target.value }) }} className={styles.input} type="text" id="title" value={newDetails.title} placeholder="Enter Package Title" />
                        </div>
                        <div className={styles.formItem}>
                            <label className={styles.label} htmlFor="title">Mualana Name</label>
                            <input onChange={(e) => { setNewDetails({ ...newDetails, maulana: { ...newDetails.maulana, name: e.target.value } }) }} className={styles.input} type="text" id="title" value={newDetails?.maulana?.name} placeholder="Enter Maulana Name" />
                        </div>
                        <div className={styles.formItem}>
                            <label className={styles.label} htmlFor="title">Mualana Image</label><br />
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                            {uploading && <p>Uploading...</p>}
                            {(imageUrl || newDetails?.maulana?.image) && (
                                <div>
                                    <p>Uploaded Image:</p>
                                    {(newDetails?.maulana?.image && newDetails?.maulana?.image) ? <Image width={300} height={300} src={newDetails?.maulana?.image} alt="Uploaded" style={{ maxWidth: "300px" }} /> : <Image width={300} height={300} src={imageUrl} alt="Uploaded" style={{ maxWidth: "300px" }} />}
                                </div>
                            )}

                            <div onClick={() => { setOpenGallary(true) }} className="primary-btn blue">Select From Gallary</div>
                        </div>
                        {
                            newDetails?.maulana?.name &&
                            <div className={styles.formItem}>
                                <label className={styles.label}>Select Position</label>
                                <div className={styles.formItem}>
                                    {
                                        newDetails.maulana.position == 'top' ? <input onChange={() => setNewDetails({ ...newDetails, maulana: { ...newDetails.maulana, position: "top" } })} defaultChecked type="radio" id="pos_top" name="maulana_pos" value="top" /> :
                                            <input onChange={() => setNewDetails({ ...newDetails, maulana: { ...newDetails.maulana, position: "top" } })} type="radio" id="pos_top" name="maulana_pos" value="top" />
                                    }
                                    <label className={styles.label} htmlFor="pos_top">Top</label>
                                </div>
                                <div className={styles.formItem}>
                                    {
                                        newDetails.maulana.position == 'bottom' ? <input onChange={() => setNewDetails({ ...newDetails, maulana: { ...newDetails.maulana, position: "bottom" } })} defaultChecked type="radio" id="pos_bottom" name="maulana_pos" value="bottom" /> :
                                            <input onChange={() => setNewDetails({ ...newDetails, maulana: { ...newDetails.maulana, position: "bottom" } })} type="radio" id="pos_bottom" name="maulana_pos" value="bottom" />
                                    }
                                    <label className={styles.label} htmlFor="pos_bottom">Bottom</label>
                                </div>
                            </div>
                        }
                        <div className={styles.formItem}>
                            <label className={styles.label} htmlFor="date">Departure Date</label>
                            <input onChange={(e) => { setNewDetails({ ...newDetails, date: e.target.value }) }} className={styles.input} type="text" id="date" value={newDetails.date} placeholder="Enter Departure Date" />
                        </div>
                        <div className={styles.formItem}>
                            <label className={styles.label} htmlFor="feature">Features</label>
                            {
                                newDetails.features.map((feature, i) => (
                                    <div key={i} className={`${styles.formItem} body-wrapper justify-start`}>
                                        <input onChange={(e) => {
                                            const updatedFeatures = [...newDetails.features];
                                            updatedFeatures[i] = e.target.value;
                                            setNewDetails({ ...newDetails, features: [...updatedFeatures] })
                                        }
                                        } className={`${styles.input} ${styles.optionsIinput}`} type="text" value={feature} placeholder="Enter New Feature" />
                                        {newDetails.isBold[i] ? <input checked type="checkbox" name="isBold" id="isBold" onChange={(e) => {
                                            let updatedIsBold = [...newDetails.isBold]
                                            updatedIsBold[i] = e.target.checked
                                            setNewDetails({ ...newDetails, isBold: [...updatedIsBold] })
                                        }} /> : <input type="checkbox" name="isBold" id="isBold" onChange={(e) => {
                                            let updatedIsBold = [...newDetails.isBold]
                                            updatedIsBold[i] = e.target.checked
                                            setNewDetails({ ...newDetails, isBold: [...updatedIsBold] })
                                        }} />}<label htmlFor="isBold">Bold?</label>
                                        <div className="delete-icon" id={i} onClick={async (e) => {

                                            let newFeatures = newDetails.features.filter((f, i) => {
                                                return i != e.target.id;
                                            });

                                            let newIsBold = newDetails.isBold.filter((f, i) => {
                                                return i != e.target.id;
                                            });
                                            setNewDetails({ ...newDetails, features: [...newFeatures], isBold: [...newIsBold] })
                                        }}>
                                            <RiDeleteBin5Fill style={{ pointerEvents: "none" }} />
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div className={styles.formItem}>
                            <button className="primary-btn blue" onClick={(e) => {
                                e.preventDefault()
                                setNewDetails({
                                    ...newDetails,
                                    features: [...newDetails.features, "Add New Feature"],
                                    isBold: [...newDetails.isBold, false]
                                })
                            }}>Add New Feature</button>
                        </div>
                        {
                            newDetails.type &&
                            <div className={styles.formItem}>
                                <label className={styles.label}>Select Type</label>
                                <div className={styles.formItem}>
                                    {
                                        newDetails.type == 'sunni' ? <input onChange={() => setNewDetails({ ...newDetails, type: "sunni" })} defaultChecked type="radio" id="sunni_type" name="package_type" value="sunni" /> :
                                            <input onChange={() => setNewDetails({ ...newDetails, type: "sunni" })} type="radio" id="sunni_type" name="package_type" value="sunni" />
                                    }
                                    <label className={styles.label} htmlFor="sunni_type">Sunni</label>
                                </div>
                                <div className={styles.formItem}>
                                    {
                                        newDetails.type == 'shia' ? <input onChange={() => setNewDetails({ ...newDetails, type: "shia" })} defaultChecked type="radio" id="shia_type" name="package_type" value="shia" /> :
                                            <input onChange={() => setNewDetails({ ...newDetails, type: "shia" })} type="radio" id="shia_type" name="package_type" value="shia" />
                                    }
                                    <label className={styles.label} htmlFor="shia_type">Shia</label>
                                </div>
                            </div>
                        }
                        <div className={styles.formItem}>
                            <label className={styles.label}>Select Category</label>
                            <div className={styles.formItem}>
                                {
                                    newDetails.category == 'dulex' ? <input onChange={() => setNewDetails({ ...newDetails, category: "dulex" })} defaultChecked type="radio" id="dulex_type" name="category_type" value="dulex" /> :
                                        <input onChange={() => setNewDetails({ ...newDetails, category: "dulex" })} type="radio" id="dulex_type" name="category_type" value="dulex" />
                                }
                                <label className={styles.label} htmlFor="dulex_type">Deluex</label>
                            </div>
                            <div className={styles.formItem}>
                                {
                                    newDetails.type == 'economy' ? <input onChange={() => setNewDetails({ ...newDetails, category: "economy" })} defaultChecked type="radio" id="economy_type" name="category_type" value="economy" /> :
                                        <input onChange={() => setNewDetails({ ...newDetails, category: "economy" })} type="radio" id="economy_type" name="category_type" value="economy" />
                                }
                                <label className={styles.label} htmlFor="economy_type">Economy</label>
                            </div>
                            <div className={styles.formItem}>
                                {
                                    newDetails.type == 'ramzan' ? <input onChange={() => setNewDetails({ ...newDetails, category: "ramzan" })} defaultChecked type="radio" id="ramzan_type" name="ramzan_type" value="ramzan" /> :
                                        <input onChange={() => setNewDetails({ ...newDetails, category: "ramzan" })} type="radio" id="ramzan_type" name="ramzan_type" value="ramzan" />
                                }
                                <label className={styles.label} htmlFor="ramzan_type">Ramzan</label>
                            </div>
                        </div>
                        {newDetails.title &&
                            <div>
                                {newDetails.hotels.length == 2 ?

                                    <input onChange={(e) => {

                                        if (e.target.checked) {
                                            setNewDetails({ ...newDetails, hotels: [] })
                                            return
                                        }
                                        setNewDetails({ ...newDetails, hotels: ["", ""] })
                                    }} defaultChecked={false} type="checkbox" name="show_hotels" id="show_hotels" value={"hotels"} />

                                    : <input onChange={(e) => {

                                        if (e.target.checked) {
                                            setNewDetails({ ...newDetails, hotels: [] })
                                            return
                                        }
                                        setNewDetails({ ...newDetails, hotels: ["", ""] })
                                    }} defaultChecked type="checkbox" name="show_hotels" id="show_hotels" value={"hotels"} />}

                                <label className={styles.label} htmlFor="shia_type">Do not show hotels</label>
                            </div>}
                        {
                            newDetails.hotels.length >= 0 && newDetails.hotels.map((hotel, i) => (
                                <div key={i} className={styles.formItem}>
                                    <label className={styles.label} htmlFor={`${i == 0 ? "makkah" : "madina"}-hotels`}>{i == 0 ? "Makkah" : "Madina"} Hotels</label>
                                    <input onChange={(e) => {
                                        const updatedHotels = [...newDetails.hotels];
                                        updatedHotels[i] = e.target.value;
                                        setNewDetails({ ...newDetails, hotels: [...updatedHotels] })
                                    }
                                    } className={styles.input} type="text" id={`${i == 0 ? "makkah" : "madina"}-hotels`} value={hotel} placeholder="Enter New Hotel" />
                                </div>
                            ))
                        }

                        <div className={styles.formItem}>
                            <label className={styles.label} htmlFor="price">Price</label>
                            <input onChange={(e) => { setNewDetails({ ...newDetails, price: e.target.value }) }} className={styles.input} type="text" id="price" value={newDetails.price} placeholder="Enter Price" />
                        </div>
                        <div className={styles.formItem}>

                            <label className={styles.label} htmlFor="vendor">Selected Vendor</label>

                            {vendors.map((vendor, i) => (
                                <div key={i} id={vendor.id} className={`${styles.formItem} body-wrapper justify-start`}>

                                    <select disabled className={`${styles.input} ${styles.optionsIinput}`} type="text" id={vendor.id} placeholder="Enter Vendor">
                                        <option selected value={vendor.title} id={vendor.id}>{vendor.title}</option>
                                    </select>
                                    <div className="delete-icon" id={vendor.id} onClick={async (e) => {
                                        await handleVendorDelete([e.target.id], details)
                                        let newVendors = vendors.filter((ven) => {
                                            return ven.id != e.target.id;
                                        });
                                        setVendors([...newVendors])
                                    }}>
                                        <RiDeleteBin5Fill style={{ pointerEvents: "none" }} />
                                    </div>
                                </div>))}

                            {newVendor.map((vendor, i) => (<div key={i} id={vendor.id} className={`${styles.formItem} body-wrapper justify-start`}>

                                <select disabled value={vendor.title} className={`${styles.input} ${styles.optionsIinput}`} id={vendor.id} placeholder="Enter Vendor">
                                    <option selected value={vendor.title} id={vendor.id}>{vendor.title}</option>
                                </select>

                                <div className="delete-icon" id={vendor.id} onClick={(e) => {
                                    let newVendors = newVendor.filter((ven) => {
                                        return ven.id != e.target.id;
                                    });
                                    setNewVendors([...newVendors])
                                }}>
                                    <RiDeleteBin5Fill style={{ pointerEvents: "none" }} />
                                </div>
                            </div>))}

                            {
                                newVendor.length == 0 && vendors.length == 0 && <p className="content">No Vendor Selected</p>
                            }
                            <div>
                                <label className={styles.label} htmlFor="newVendor">Add a new Vendor</label>
                                <div className={`${styles.formItem} body-wrapper justify-start`}>
                                    <select onChange={(e) => {
                                        if (e.target.selectedOptions[0].id == "default") {
                                            return;
                                        }
                                        setNewSelectedVendor({ id: e.target.selectedOptions[0].id, title: e.target.selectedOptions[0].value })
                                    }} className={`${styles.input} ${styles.optionsIinput}`}>
                                        <option value="" id="default">Please Choose a Vendor</option>
                                        {
                                            allVendors.map((v, i) => (

                                                <option key={i} id={v.id} value={v.title}>{v.title}</option>


                                            ))
                                        }
                                    </select>
                                    <div className="check-icon" onClick={() => {
                                        let index = newVendor.findIndex(v => v.id == newSelectedVendor.id);
                                        if (index > -1) {
                                            return;
                                        }
                                        let index2 = vendors.findIndex(v => v.id == newSelectedVendor.id);
                                        if (index2 > -1) {
                                            return;
                                        }
                                        if (newSelectedVendor.title) {
                                            setNewVendors([...newVendor, newSelectedVendor])
                                        }
                                    }}>
                                        <BsCheck style={{ pointerEvents: "none" }} />
                                    </div>
                                </div>
                            </div>

                        </div>
                        <button onClick={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }} className="primary-btn blue">Submit</button>
                        <br></br>
                        <br></br>
                        <br></br>
                    </form>
                </div>
                <div style={{ width: "50%" }}>
                    <PackageCard tour={newDetails} type={packageid} subType={newDetails.type ? newDetails.type : ""} />




                    {/* {
                newDetails.flights?.length > 0 && 
                <div>
                      <p className="subHeading">Selected Flights</p>
                    {newDetails.flights.map((flight , i)=>(
                        <div key={i} className="body-wrapper justify-start">
                            <input disabled type="text" className={`${styles.input} ${styles.optionsIinput}`} value={flight.title} />
                            <div className="delete-icon" id={i} onClick={async (e) => {
                                    
                                }}>
                                    <RiDeleteBin5Fill style={{ pointerEvents: "none" }} />
                                </div>
                        </div>
                    ))
}
                </div>
            } */}

                </div>
            </div>
            {
                newDetails.flights && <FlightsTable details={newDetails.flights} admin={true} onDelete={delteFlight} />
            }
            <form>
                <p className="subHeading">Add New Flight</p>
                <div className="body-wrapper">
                    <div className={styles.formItem}>
                        <label className={styles.label} htmlFor="flighttitle">Flight</label>
                        <input onChange={(e) => { setNewFlight({ ...newFlight, title: e.target.value }) }} className={styles.input} type="text" id="flighttitle" placeholder="Enter Flight Title" />
                    </div>
                    <div className={styles.formItem}>
                        <label className={styles.label} htmlFor="date">Date</label>
                        <input onChange={(e) => { setNewFlight({ ...newFlight, date: e.target.value }) }} className={styles.input} type="text" id="date" placeholder="Enter Date" />
                    </div>
                    <div className={styles.formItem}>
                        <label className={styles.label} htmlFor="sector">Sector</label>
                        <input onChange={(e) => { setNewFlight({ ...newFlight, sector: e.target.value }) }} className={styles.input} type="text" id="sector" placeholder="Enter Sector" />
                    </div>
                    <div className={styles.formItem}>
                        <label className={styles.label} htmlFor="filghtdeparturedate">Time</label>
                        <input onChange={(e) => { setNewFlight({ ...newFlight, time: e.target.value }) }} className={styles.input} type="text" id="filghtdeparturedate" placeholder="Enter time" />
                    </div>
                </div>
                <button className="primary-btn blue" onClick={(e) => {
                    e.preventDefault()
                    let newFlightsToAdd = newDetails.flights?.length > 0 ? [...newDetails.flights, newFlight] : [{ ...newFlight }];
                    setNewDetails({ ...newDetails, flights: [...newFlightsToAdd] })
                    let data = newDetails;
                    data.flights = newFlightsToAdd
                    handleSubmit(data);
                }}>Add Flight</button>
                <br></br>
                <br></br>
                <br></br>
            </form>
        </div>
    )
}

export default PackageEditForm;
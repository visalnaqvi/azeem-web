import FlightPopUp from "@/components/flights/container/popUp";
import IconList from "../../lists/iconList";
import styles from "./packageCard.module.css"
import { useEffect, useState } from "react";
import { getPackageVendor } from "@/services/vendor";
import { AiFillDelete, AiFillEdit } from "react-icons/ai"
import Link from "next/link";
import { checkStorageForAdminToken } from "@/services/auth";
import { deletePackage } from "@/services/deleteData";
import Image from "next/image";

const PackageCard = ({ tour, type, subType, fetchData }) => {

    const [isFlightsOpen, setIsFlightsOpen] = useState(false)
    const [vendors, setVendors] = useState({ title: "" })
    const [vendorString, setVendorString] = useState("No Vendor")
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        setIsAdmin(checkStorageForAdminToken());
        fetchVendors();
    }, [])

    const fetchVendors = async () => {
        setVendors(await getPackageVendor(tour.id))
    }

    useEffect(() => {
        if (vendors.length > 0) {
            let vendorString = "";
            vendors.forEach(ven => { vendorString = vendorString + ven.title + " , " });
            setVendorString(vendorString)
        }
    }, [vendors])

    return (
        <div>

            <div className={`${styles.card}  ${styles[type]} ${styles[subType]}`}>
                {isAdmin && <div className={`${styles.quickEditBar} body-wrapper`}>
                    <div className={styles.vendorList}>
                        {vendorString && <p style={{ cursor: "pointer" }} title={vendorString}>View Vendors</p>}
                    </div>
                    <div className={`${styles.iconBox} body-wrapper`}>
                        <Link href={`/admin-panel/${type}/${tour.id}`}> <div className={`${styles.icon} ${styles.editIcon}`}><AiFillEdit style={{ pointerEvents: "none" }} /></div></Link>
                        <div onClick={async () => {
                            if (window.confirm("pkka delte krna hai?")) {
                                await deletePackage(tour.id, type)
                                fetchData()
                            }
                        }} className={`${styles.icon} ${styles.deleteIcon}`}><AiFillDelete style={{ pointerEvents: "none" }} /></div>
                    </div>
                </div>}


                <div className={styles.content}>


                    <div className={styles.headerWrapper}>
                        <div className={styles.headerContent}>
                            <h2>{tour.title}</h2>

                            {tour?.maulana?.image && tour?.maulana?.image.length > 0 && tour?.maulana?.position == "top" && tour?.maulana?.name && tour?.maulana?.name.length > 0 &&
                                <div className={styles.maulana}>
                                    <div className={styles.maulanaName}>{tour?.maulana?.name.split('`').map((line, index) => (
                                        <p key={index}>{line.trim()}</p>
                                    ))}</div>
                                    <Image className={styles.maulanaImageMobile} src={tour?.maulana?.image} width={150} height={150} alt="maulana" />
                                </div>
                            }
                            <h3 className={styles.callToActionYellow}>Departure: {tour.date}</h3>
                        </div>
                        {tour?.maulana?.image && tour?.maulana?.image.length > 0 && tour?.maulana?.position == "top" && tour?.maulana?.name && tour?.maulana?.name.length > 0 &&

                            <Image className={styles.maulanaImageDesktop} src={tour?.maulana?.image} width={150} height={150} alt="maulana" />

                        }
                    </div>
                    <div className={styles.contentWrapper}>
                        <br />
                        <IconList items={tour.features} isBold={tour.isBold} />

                    </div>
                </div>
                {tour?.maulana?.image && tour?.maulana?.image.length > 0 && tour?.maulana?.position == "bottom" && <div className={`${styles.beforeFooter} ${styles.maulana}`}>
                    <div className={styles.maulanaName}><p>{tour?.maulana?.name}</p></div>
                    <Image src={tour?.maulana?.image} width={300} height={300} alt="maulana" />
                </div>
                }
                {tour.hotels.length != 0 && <div className={styles.beforeFooter}>
                    <div className={styles.beforeFooterSection}>
                        <p className={styles.beforeHeaderSectionHeading}>Makkah Hotel</p>
                        <p className={styles.beforeHeaderSectionContent}>{tour.hotels[0]}</p>
                    </div>
                    <div className={styles.beforeFooterSection}>
                        <p className={styles.beforeHeaderSectionHeading}>Madina Hotel</p>
                        <p className={styles.beforeHeaderSectionContent}>{tour.hotels[1]}</p>
                    </div>
                </div>}
                <div className={styles.footer}>
                    <p className={styles.footertext}>At Just Rs. {tour.price}/-</p>
                    <button onClick={() => {
                        if (tour.flights?.length > 0) {
                            setIsFlightsOpen(true);
                        }
                    }} className={styles.footerButton}>View Flight</button>
                </div>
                {isFlightsOpen && <FlightPopUp setIsFlightsOpen={setIsFlightsOpen} details={tour.flights} />}
            </div>
        </div>
    )
}

export default PackageCard;
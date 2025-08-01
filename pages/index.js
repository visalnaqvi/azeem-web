import ImageCard from "@/components/cards/imageCard/imageCard"
import CarouselComp from "@/components/carousel/carousel"
import services from "../data/services.js"
import features from "../data/features.js"
import Map from "../components/map/map.js"
import { useWindowSize } from "@uidotdev/usehooks";
import ContactBox from "@/components/contactBox/contactBox/contactBox.js"
import Head from "next/head.js"
export default function Home() {
  const desktopImages = [
    "/sliders/homePageSlider/desktop/slider_1.png",
    "/sliders/homePageSlider/desktop/slider_2.png",
    "/sliders/homePageSlider/desktop/slider_3.png",

  ]

  const mobileImages = [
    "/sliders/homePageSlider/mobile/slider_1_mb.png",
    "/sliders/homePageSlider/mobile/slider_2_mb.png",

  ]
  const size = useWindowSize();
  return (

    <div>
      <Head>
        <title>Shia Qafila Hajj , Umrah , Ziyarat | Home</title>
        <meta name="keywords" content="Shia Qafila umrah Package, 
Umrah package from Delhi ,
Umrah package from Lucknow,
Umrah package from Prayagraj, 
Best umrah package,
Cheapest umrah package,
Umrah package Shia muslims,
Iran Iraq syria Ziyarat package,
Iraq Iran ziyarat package from Delhi, 
Iran Iraq Ziyarat package from Lucknow, 
Iran Iraq Ziyarat package from Prayagraj,
Iran Iraq Syria Ziyarat Package for Shia Muslim,
Shia Iran Iraq Syria Ziyarat Package ,
Best Iraq Iraq Ziyarat package,Iraq Ziyarat,
Iraq Ziarat,
Iraq Ziyarat Travel Agent,
Iraq Ziyarat Packages,
Iraq Ziyarat Places,
Iraq Ziyarat Visa for India,
Iraq Ziyarat Packages From India,
Iraq Ziyarat Packages from Delhi,
Iran Iraq Ziyarat Package,
Syria Ziyarat package,
Iraq ziyarat Packages from Delhi,
Iraq Ziarat Package from Delhi,
Iran Iraq Ziarat Package from Delhi,
Shaikh Abdul Qadir Jilani (RA) Ziyarat,
Ziyarat Ghous E Azam,
Imam Hussain Roza,
Imam Hussain shrine Ziyarat,
Best Ziyarat Package,
Best Tour Operator,
Ziyarat kafila from Delhi,
Iraq Ziyarat packages from Lucknow,
Iraq Ziyarat Package from Jammu and Srinagar,
Iraq Ziyarat package from Jaipur,
Iraq Ziyarat package from Kolkata,
Iraq Ziyarat package from Punjab,
iraq ziyarat packages,
iraq ziyarat tours,
ziyarat iraq package,
baghdad ziyarat,
iran iraq ziyarat packages from india,
umrah and karbala package,
baghdad sharif and umrah package,
iraq ziarat packages,
ziyarat trips to iraq,
umrah with iraq ziyarat tour packages,
iran iraq ziyarat tour,
iran iraq ziyarat,
iraq ziyarat tours from india,
umrah karbala package,
karbala group,
karbala ziyarat,
karbala group package,
arbaeen package"></meta>
      </Head>
      {
        size.width > 700 ?
          <CarouselComp width={2000} height={550} images={desktopImages} /> :
          <CarouselComp width={700} height={200} images={mobileImages} />
      }
      <div className="margin">
        <div className="body-wrapper justify-between">
          <h2 className="subHeading">Our foundation</h2>
          <a className="contact-button" href="tel:+919811042458"><button className="primary-btn blue">Contact Us On: +919811042458</button></a>
        </div>
        <p className="content">We present before you Shia Qafila Hajj , Umrah , Ziyarat as one stop platform for all your travel needs.With a focus on customer service, at Shia Qafila Hajj , Umrah , Ziyarat we offer a fantastic range of trips to meet your budget , ambitions and expectations. All of us here in the Shia Qafila team, work tirelessly to ensure that your trip is carefree, successful and enjoyable experience from start to finish. That means attention to your travel plans, accommodation, specialist inclusions and leisure time as well as to health and safety, financial protection and travel insurance.Specialist knowledge and experience is only half of the story. What distinguishes ous is our passion for the trips we organise, for the destinations that we feature. We feature trips around the worldand our latest inclusion is tour to Saudi Arabia.</p>

        <h2 className="boldHeading center">Our Services</h2>
        <div className="body-wrapper">
          {
            services.map((d, i) => (
              <ImageCard key={i} data={d} />
            ))
          }
        </div>
        <h2 className="subHeading center">Why to choose Us?</h2>
        <p className="content center">Since established our primary aim was to provide quality tour and travel package services to business and leisure travelers. Supported by strong financial management, impressive customer satisfaction, and constant improvement, Shia Qafila Hajj , Umrah , Ziyarat has expanded to cover various facets of the industry. Our experience led to perfection in both our outbound and inbound units. All our tour packages are designed and planed keeping in mind your needs and comfortability. We will choose the best options available in market . And take care of all your needs.</p>
      </div>
      <div className="body-wrapper">
        {
          features.map((d, i) => (
            <ImageCard key={i} data={d} />
          ))
        }
      </div>


      <br></br>
    </div>
  )
}

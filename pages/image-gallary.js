import ImageGallery from "@/components/image-gallary/image-gallary";
import { deleteImage } from "@/services/storage";
const Images = () => {
    const handleDelete = async (path, url) => {
        if (!window.confirm("Are you sure you want to delete this image?")) return;

        try {
            await deleteImage(path);
            alert("Image deleted");
        } catch (err) {
            console.error("Failed to delete image:", err);
            alert("Failed to delete");
        }
    };
    return <ImageGallery onClick={handleDelete} btnText={"Delete Image"} btnType={"warning"} />;
}

export default Images
import HelpRequestCard from "./HelpRequestCard";
import VolunteerMatchCard from "./VolunteerMatchCard";

export default function NotificationCard({item}) {
    return (
        // <HelpRequestCard item={item} />
        item?.status=="Open" ?
            <VolunteerMatchCard item={item} />:
            <HelpRequestCard item={item} />
    )
}
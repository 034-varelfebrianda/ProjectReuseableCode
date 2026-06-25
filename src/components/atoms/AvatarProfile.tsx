interface AvatarProps{
    initials:string;
}

export default function Avatar({
    initials
}:AvatarProps){
    return(
        <button className="flex h-9 w-9 items-center justify-center text-12px rounded-full bg-sky-500 font-semibold text-white  hover:cursor-pointer">
            {initials}
        </button>
    )
}

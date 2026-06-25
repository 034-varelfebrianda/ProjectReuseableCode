interface SearchTextProps{
    text ?: string
}

export default function SearchText({
    text="Search"
}:SearchTextProps){
    return(<div className="">
        <span className="text-zinc-400 text-sm">{text}</span>
    </div>
    )
}
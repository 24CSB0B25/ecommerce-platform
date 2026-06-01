function Spinner() {
    return (
        <div
        className="
            min-h-[60vh]
            flex
            justify-center
            items-center
        "
        >
        <div
            className="
            w-14
            h-14
            border-4
            border-slate-700
            border-t-amber-400
            rounded-full
            animate-spin
            "
        ></div>
        </div>
    );
}

export default Spinner;
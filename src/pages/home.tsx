import { Play } from "lucide-react";

export default function Home() {
  return (
    <section className=' bg-white h-screen flex items-center justify-center mx-auto'>
      <div>

    <div className='  text-center'>
    <p className='text-[15px] uppercase font-semibold text-emerald-600'>loncatan digital masa depan</p>

    <h1 className="text-4xl font-extrabold py-4 tracking-wide">Solusi Cerdas Untuk Bisnis 
      <br />
      Modern
    </h1>

    <p className="mx-auto max-w-2x1 px-100 text-[20px]">Maksimalkan efisiensi operasional dan dorong pertumbuhan eksponensial dengan platform SaaS yang terintegrasi, aman, dan dirancang khusus untuk skala enterprise.</p>
    </div>

    <div className="  gap-10 text-center py-5  flex justify-center items-center">
      <button className="border-b-green-300 bg-green-800 text-white font-bold px-3 py-2 hover: cursor-pointer hover:bg-black hover:shadow-xl">Mulai Sekarang</button>
      <button className="border py-2 gap-3 items-center flex px-3 hover:cursor-pointer hover:shadow-xl">
        <Play className="size-4"></Play>
        <p className="font-bold">
        Lihat Demo
        </p>
        </button>
    </div>
      </div>
    </section>
  )
}

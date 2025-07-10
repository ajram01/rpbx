import Image from "next/image";

export default function Home() {
  return (
    <div>
      {/* Div 1: 2 rows */}
      <div className="flex flex-col bg-[url('/images/backgrounds/white-bg.png')] bg-cover bg-center">
        <div>
          <h1>header will go somewhere in this div</h1>
        </div>
        <div className="flex flex-row">
          <div className="flex-1 flex justify-end items-center p-[15px]">
            <div className="flex flex-col items-center w-[560px]">
              <h1>RPBX</h1>
              <p>form will go in here somewhere</p>
            </div>
          </div>
          <div className="flex-1">
            <Image
              src="/images/other/home-header.png"
              alt="Investors and Business Owners"
              width={2000}
              height={450}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Div 2: 1 div containing 3 div columns */}
      <div className="bg-[url('/images/backgrounds/black-bg.png')] bg-cover bg-center bg-fixed flex justify-center p-[15px]">
        <div className="flex flex-row gap-x-[15px] w-[1140px] ">
          <div className="bg-white flex-1 min-h-[500px]">Div 2 - Col 1</div>
          <div className="bg-white flex-1 min-h-[500px]">Div 2 - Col 2</div>
          <div className="bg-white flex-1 min-h-[500px]">Div 2 - Col 3</div>
        </div>
      </div>

      {/* Div 3: 3 rows */}
      <div className="flex flex-col items-center bg-[url('/images/backgrounds/white-bg.png')] bg-cover bg-center p-[15px]">

        <div className="flex flex-row gap-x-[15px] ">
          <div className="flex-1 flex justify-end">
            <div className="bg-green-200 flex flex-col items-start w-[560px]">
              <h2>RPBX</h2>
              <p>text or something</p>
            </div>
          </div>
          <div className="flex-1 flex justify-start">
            <div className="bg-green-200 flex flex-col items-center w-[560px]">
              <h2>RPBX</h2>
              <p>text or something</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-500">Div 3 - Row 2</div>

        <div className="bg-green-600 w-[1140px] flex flex-col items-center">
          <h2>Here is a heading</h2>
          <p>Here is some text</p>
          <div className="flex flex-row gap-x-[5px] w-full">

            <div className="bg-green-700 flex-1 flex flex-col items-center">
              <h4>icon</h4>
              <p>text possibly</p>
            </div>
            <div className="bg-green-700 flex-1 flex flex-col items-center">
              <h4>icon</h4>
              <p>text possibly</p>
            </div>
            <div className="bg-green-700 flex-1 flex flex-col items-center">
              <h4>icon</h4>
              <p>text possibly</p>
            </div>
            <div className="bg-green-700 flex-1 flex flex-col items-center">
              <h4>icon</h4>
              <p>text possibly</p>
            </div>

          </div>
        </div>
      </div>



      {/* Div 4: 1 div */}
      <div className="bg-purple-300 flex flex-col items-center bg-[url('/images/backgrounds/black-mint-bg.png')] bg-cover bg-center bg-fixed p-[15px]">
        <div className="bg-white flex flex-col items-center items-center w-[1140px] min-h-[300px]">
          <h2>the newsletter</h2>
          <p>big chunk of text</p>
        </div>
      </div>
    </div>
  );
}

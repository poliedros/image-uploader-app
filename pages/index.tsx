import { useState } from "react";
import type { NextPage } from "next";
import axios from "axios";
import Head from "next/head";

// const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function uploadFile(file: File | undefined) {
  const request = {
    file,
  };

  const { data } = await axios.post("https://api.images.czar.dev", request, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const id = data.id;

  return `https://catalogv2.blob.core.windows.net/storage-images/${id}`;
}

// async function uploadFileMock(file: File | undefined) {
//   await delay(2000);
//   const id = "62ef3b70c6997747ea7dc961";
//   return `https://catalogv2.blob.core.windows.net/storage-images/${id}`;
// }

const Home: NextPage = () => {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState<string | undefined>(undefined);

  async function handleClick() {
    setLoading(true);
    const linkResponse = await uploadFile(file);
    setLink(linkResponse);
    setLoading(false);
  }

  return (
    <div className="container mx-auto">
      <Head>
        <title>Image Uploader</title>
      </Head>

      <Description />

      <Dropdown file={file} onChange={setFile} />

      {loading ? (
        <Spinner />
      ) : (
        <>
          {file ? (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleClick}
            >
              Upload
            </button>
          ) : (
            <></>
          )}
        </>
      )}

      <hr />
      {link ? (
        <a
          href={link}
          className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
        >
          Click here to see the file
        </a>
      ) : (
        <></>
      )}
    </div>
  );
};

function Description() {
  return (
    <>
      <h1 className="font-medium leading-tight text-5xl mt-0 text-gray-600">
        Image uploader
      </h1>
      <p>
        This is a image uploader example built by{" "}
        <a href="https://czar.dev">Czar+</a>
      </p>
      <p>This file will live for 2 days.</p>
    </>
  );
}

function Spinner() {
  return (
    <>
      <div role="status">
        <svg
          aria-hidden="true"
          className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    </>
  );
}

function Dropdown({ file, onChange = () => {} }: any) {
  const [bigFileWarning, setBigFileWarning] = useState(false);

  return (
    <div className="flex justify-center items-center w-full">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
      >
        <div className="flex flex-col justify-center items-center pt-5 pb-6">
          <svg
            aria-hidden="true"
            className="mb-3 w-10 h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
          {file ? (
            <h1>{file.name}</h1>
          ) : (
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
          )}
          <p
            className={`text-xs ${
              bigFileWarning ? "text-red-500" : "text-gray-500"
            } dark:text-gray-400`}
          >
            Maximum: 2Mb
          </p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setBigFileWarning(false);

            const TWO_MBs = 2097152;
            const files = e.target.files;

            if (!files) return;

            if (files.length <= 0) return;

            if (files[0].size > TWO_MBs) {
              setBigFileWarning(true);
              onChange(undefined);
              return;
            }

            onChange(files[0]);
          }}
        />
      </label>
    </div>
  );
}

export default Home;

import React from "react";

function UserRepo({ item }) {
  return (
    <>
      {item === null ? (
        <p>Loading</p>
      ) : (
        <div className="w-full rounded-t-lg rounded-b-md border border-t-4 border-slate-100 border-t-blue-400 px-8 py-4 shadow-lg mb-8">
          <div className="flex flex-row items-center justify-between border-b pb-4">
            <div>
              {item.github === "undefined" ? (
                <h1 className="text-2xl font-semibold text-slate-700">
                  {item.name}
                </h1>
              ) : (
                <a href={item.github} target="_blank" rel="noopener noreferrer">
                  <h1 className="text-2xl font-semibold text-slate-700 hover:underline">
                    {item.name}
                  </h1>
                </a>
              )}
              <p className="text-sm text-slate-600">{item.description}</p>
            </div>
            <div className="flex flex-row items-center gap-4">
              <div className="flex flex-row items-center gap-1">
                <i className="fa-solid fa-star text-base text-[#9c7140]"></i>
                <span className="text-yellow-900 text-lg font-semibold">
                  {item.stargazers_count}
                </span>
              </div>
              <div className="flex flex-row items-center gap-1">
                <i className="fa-solid fa-code-commit text-base text-[#9c7140]"></i>
                <span className="text-yellow-900 text-lg font-semibold">
                  {item.forks_count}
                </span>
              </div>
              <div className="flex flex-row items-center gap-1">
                <a
                  href={`${item.html_url}/issues`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/path/to/warning-sign.png" // Replace with the actual path to the warning sign image
                    alt="Warning"
                    className="w-5 h-5"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserRepo;

import axios from "axios";

import React, { useState } from "react";
import LoadingOverlay from "react-loading-overlay";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [tokenId, setTokenId] = useState(1);
  const [data, setData] = useState();

  const [projectName, setProjectName] = useState("");
  const [maxAmount, setMaxAmount] = useState();
  const [collectionAmount, setCollectionAmount] = useState(10);

  const [files, setFiles] = useState([]);

  const onFileChange = (event, index) => {
    let newState = [...files];
    newState[index].files = event.target.files;
    newState[index].weights = new Array(newState[index].files.length).fill(0);
    setFiles(newState);

    let sum = 1;
    for (let i = 0; i < newState.length; i++) {
      sum *= newState[i].files.length;
    }

    setMaxAmount(sum);
  };

  const click = async () => {
    const resp = await axios.post(
      "http://20.123.154.231:5000/api/getnft",
      {
        owner: "Berat",
        project_name: "WODITEST",
        token_id: 0,
      },
      {
        responseType: "blob",
      }
    );

    console.log(resp.data);
    let matrixBlob = new Blob([resp.data], {
      type: "image/jpg",
    });
    console.log(matrixBlob);
    let fileReader = new FileReader();
    fileReader.readAsDataURL(matrixBlob);
    fileReader.onload = () => {
      let result = fileReader.result;
      console.log(result);
      setData(result);
    };
  };

  const onFileUpload = async () => {
    if (!projectName) {
      alert("PROJECT NAME");
      return;
    }
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      for (let j = 0; j < files[i].files.length; j++) {
        let item = files[i].files;
        console.log(item);
        formData.append(files[i].name, item[j], item[j].name); // Chain , Files , Image name
      }
    }

    let object = {
      project_name: projectName,
      owner: "Berat",
      traits: Array.from(files).map((elem) => {
        return { name: elem.name, weights: elem.weights };
      }),
    };

    formData.append("data", JSON.stringify(object));
    setLoading(true);

    await axios
      .post("http://20.123.154.231:5000/api/uploadfile", formData, {
        "content-type": "multipart/form-data",
      })
      .then(async (resp) => {
        setLoading(false);

        // const resp = await axios.get("http://20.123.154.231:5000/api/getnft", {
        //   data: {
        //     owner: "Berat",
        //     projectName: "WODITEST",
        //     token_id: 0,
        //   },
        // });

        // const blob = await resp.data.blob();
        // const url = URL.createObjectURL(blob);
        // setData(url);
      })
      .catch((err) => {
        console.error(err.message);
        setLoading(false);
      });
  };

  const handleAddLink = () => {
    console.log(files.length);
    if (files.length == 6) {
      alert("Maximum 6");
    } else {
      setFiles([...files, { name: null, files: [], weights: [] }]);
    }
  };

  const traitNameChange = (e, index) => {
    let newState = [...files];
    newState[index].name = e.target.value;
    setFiles(newState);
  };

  const weightChanged = (e, index, itemIndex) => {
    let newState = [...files];
    newState[index].weights[itemIndex] = e.target.value;
    setFiles(newState);
  };

  const handleDeleteLink = (index) => {
    var array = [...files];
    array.splice(index, 1);
    setFiles(array);
  };

  const nextImageHandler = async () => {
    const resp = await axios.post(
      "http://20.123.154.231:5000/api/getnft",
      {
        owner: "Berat",
        project_name: "WODITEST",
        token_id: tokenId,
      },
      {
        responseType: "blob",
      }
    );

    let matrixBlob = new Blob([resp.data], {
      type: "image/jpg",
    });
    let fileReader = new FileReader();
    fileReader.readAsDataURL(matrixBlob);
    fileReader.onload = () => {
      let result = fileReader.result;
      setData(result);
    };

    setTokenId(tokenId + 1);
  };

  return (
    <div style={{ width: "100% !important", height: "100% !important" }}>
      <LoadingOverlay active={loading} spinner text="Loading your content...">
        <h3 className="text-center" onClick={click}>
          File Upload using React!
        </h3>
        <p className="display-6">Project Name</p>
        <input type={"text"} onChange={(e) => setProjectName(e.target.value)} />
        <div className="d-flex flex-row justify-content-around mt-3">
          <div>
            <p className="display-6">NFT Amount</p>
            <input
              type={"number"}
              onChange={(e) => {
                if (e.target.value == "") {
                  setCollectionAmount(0);
                } else setCollectionAmount(e.target.value);
              }}
            />
          </div>
          <div>
            <p className="display-6" style={{ marginBottom: 0 }}>
              Max NFT
            </p>
            <p
              className="display-4 text-center text-light"
              style={
                parseInt(maxAmount) < parseInt(collectionAmount)
                  ? { background: "red" }
                  : { background: "green" }
              }
            >
              {maxAmount == undefined ? 0 : maxAmount}
            </p>
          </div>
        </div>
        <div>
          <p className="display-4 text-center">Add trait</p>
          <button
            className="btn btn-primary"
            style={{ position: "relative", left: "40%" }}
            onClick={() => {
              console.log(files);
            }}
          >
            ?
          </button>
          <div className="mb-1">
            <button
              className="btn btn-primary mt-2"
              onClick={handleAddLink}
              style={{ position: "relative", left: "40%" }}
            >
              +
            </button>
          </div>
          {files.map((item, index) => {
            return (
              <div key={index}>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteLink(index)}
                >
                  X
                </button>
                <input
                  type="text"
                  placeholder="Trait name"
                  onChange={(e) => traitNameChange(e, index)}
                />
                <input
                  type="file"
                  onChange={(e) => onFileChange(e, index)} // index
                  multiple
                />

                {Array.from(item.files).map((elem, itemIndex) => (
                  <div key={elem.name} className="d-flex w-50 flex-row mt-1">
                    <p className="m-auto">{elem.name}</p>
                    <input
                      type={"number"}
                      placeholder="Weight"
                      onChange={(e) => {
                        weightChanged(e, index, itemIndex);
                      }}
                      value={files[index].weights[itemIndex]}
                    />
                  </div>
                ))}
              </div>
            );
          })}
          <button
            className="btn btn-success mt-5 pl-4"
            style={{ position: "relative", left: "40%" }}
            onClick={onFileUpload}
          >
            <span>Upload</span>
          </button>
        </div>

        {data ? (
          <div>
            <div
              style={{
                width: 50,
                height: 50,
                background: "red",
                cursor: "pointer",
              }}
              onClick={nextImageHandler}
            >
              +
            </div>
            <img src={data} alt="..." width={500} height={500} />
          </div>
        ) : null}
      </LoadingOverlay>
    </div>
  );
};

export default App;

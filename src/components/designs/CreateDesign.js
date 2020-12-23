import React, { useContext, useEffect, useRef, useState } from "react"
import { useHistory } from "react-router-dom";
import { Modal, ModalBody, ModalFooter, ModalHeader, Collapse, Button } from "reactstrap";
import { Line, Layer, Rect } from "konva";
import { Stage } from 'react-konva';
import { TwitterPicker } from 'react-color';
import { CategoryContext } from "./CategoryProvider";
import { ColorContext } from "./ColorProvider";
import { DesignContext } from "./DesignProvider";
import "./CreateDesign.css"


export const CreateDesign = () => {
  // CONTEXT, REF, CUSTOM HOOK(S)
  const { getCategories, categories } = useContext(CategoryContext)
  const { colors, getColors } = useContext(ColorContext)
  const { addDesign } = useContext(DesignContext)
  const stageRef = useRef(null)
  const history = useHistory()

  // STATE
  const [gridObj, setGridObj] = useState({ width: 896, height: 896 })
  const [formGridObj, setFormGridObj] = useState({})
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [designObj, setDesignObj] = useState({})
  const [color, setColor] = useState("#000000")

  const [deleteMode, setDeleteMode] = useState(false)
  const toggleDelete = () => setDeleteMode(!deleteMode)

  //MODALS AND COLLAPSES
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [colorCollapse, setColorCollapse] = useState(false);
  const toggleColorCollapse = () => setColorCollapse(!colorCollapse);
  const [dimensionsCollapse, setDimensionsCollapse] = useState(false);
  const toggleDimensions = () => setDimensionsCollapse(!dimensionsCollapse);
  

  //create layer to make the grid, global because it gets called in a useEffect AND drawRect function
  const gridLayer = new Layer({ id: "grid" })

  //the get functions
  useEffect(() => {
    getCategories()
    getColors()
  }, [])

  //this useEffect creates the grid
  useEffect(() => {
    const blockSnapSize = 16;
    const padding = blockSnapSize;
    const width = gridObj.width
    const height = gridObj.height

    //last vertical line
    gridLayer.add(new Line({
      points: [896, 0, 896, 896],
      stroke: '#222',
      strokeWidth: 2
    }));

    //last horizontal line
    gridLayer.add(new Line({
      points: [0, 896, 896, 896],
      stroke: '#222',
      strokeWidth: 2
    }));


    // vertical lines
    for (let i = 0; i < width / padding; i++) {
      //creates the thicker lines
      let lineWidth = 1
      if (i % 5 === 0) {
        lineWidth = 3
      }
      gridLayer.add(new Line({
        //points: [ x1, y1, x2, y2 ]
        points: [Math.round(i * padding) + 0.5, 0, Math.round(i * padding) + 0.5, height],
        stroke: '#222',
        strokeWidth: lineWidth,
      }));
    }


    // horizontal lines
    for (let j = 0; j < height / padding; j++) {
      //creates the thicker lines
      let lineWidth = 0.75
      if (j % 5 === 0) {
        lineWidth = 2.75
      }
      gridLayer.add(new Line({
        points: [0, Math.round(j * padding), width, Math.round(j * padding)],
        stroke: '#222',
        strokeWidth: lineWidth,
      }));
    }

    //add layer to the stage and redraw the stage
    stageRef.current.add(gridLayer)
    stageRef.current.draw()
  }, [])

  //this useEffect updates the search results
  useEffect(() => {
    if (searchTerm !== "") {
      const results = colors.filter(c => c.floss_number.includes(searchTerm))
      setSearchResults(results);
    }
  }, [searchTerm])


  // SETS THE COLOR OF THE SQUARES
  const userColor = (e) => {
    setColor(e.hex)
  }

  // ADDS SQUARE TO GRID
  const drawRectangle = (e) => {
    const blockSnapSize = 16;

    //get the x, y positions of the click
    const coordinates = stageRef.current.getPointerPosition()

    let arr = []
    let arr2 = []
    const clickX = coordinates.x
    const clickY = coordinates.y

    //finds the closest x coordinate (without going over)
    for (let i = 0; i < clickX; i += 16) {
      if (i > clickX) {
        break;
      } else {
        arr.push(i)
      }
    }

    //finds the closest y coordinate (without going over)
    for (let i = 0; i < clickY; i += 16) {
      if (i > clickY) {
        break;
      } else {
        arr2.push(i)
      }
    }

    //together, they make the top left corner of the Konva Rect
    const newX = arr.slice(-1)
    const newY = arr2.slice(-1)

    //create a rectangle 
    const rectangle = new Rect({
      //if an x, y property gets defined, subtract that from the coordinate
      x: (newX[0]),
      y: (newY[0]),
      height: blockSnapSize,
      width: blockSnapSize,
      fill: color,
      stroke: 'black',
      strokeWidth: 0.5,
      draggable: false
    })

    //add the rectangle to the layer then draw
    gridLayer.add(rectangle)
    // gridLayer.draw()

    //add the layer to the stage
    stageRef.current.add(gridLayer)
  }

  // HANDLING THE DESIGN OBJ
  const onChange = (e) => {
    const newDesign = Object.assign({}, designObj)
    if (e.target.name === "public") {
      newDesign[e.target.name] = e.target.checked
    } else {
      newDesign[e.target.name] = e.target.value
    }
    setDesignObj(newDesign)
  }

  // CHANGING GRID DIMENSIONS
  const onGridChange = (e) => {
    const newDimensions = Object.assign({}, formGridObj)
    newDimensions[e.target.name] = parseInt(e.target.value) * 224
    setFormGridObj(newDimensions)
    console.log(formGridObj)
  }

  // DMC CONVERTER AND DELETE MODE
  const handleChange = event => {
    // if (event.target.name === "deleteMode") {
    //   if (deleteMode) {
    //     setDeleteMode(false)
    //   } else {
    //     setDeleteMode(true)
    //     setColor('#FFFFFF')
    //   }
    // } else
     if (event.target.name === "dmc_search") {
      const userInput = event.target.value.toLowerCase()
      setSearchTerm(userInput);
    }
  };

  // SAVING THE DESIGN TO THE DATABASE
  const constructPattern = () => {
    const canvas = stageRef.current.toCanvas()
    const img = canvas.toDataURL()

    addDesign({
      title: designObj.title,
      link: "",
      design_img: img,
      category_id: designObj.category_id,
      public: designObj.public
    })
      .then(() => {
        toggle()
        history.push('/homepage')
      })

  }

  return (
    <>
      <Button onClick={toggle} >save pattern</Button>
      <Button onClick={toggleDimensions} color="primary">Change Dimensions</Button>
      <Collapse isOpen={dimensionsCollapse}>
        <form>
          <h4>Project Height</h4>
          <input type="text" name="height" placeholder="height in inches" value={formGridObj.height} onChange={onGridChange} />
          <h4>Project Width</h4>
          <input type="text" name="width" placeholder="width in inches" value={formGridObj.width} onChange={onGridChange} />
          <button onClick={(e) => {
            e.preventDefault()
            setGridObj(formGridObj)
          }}>Change Dimensions</button>
        </form>
      </Collapse>
      <Button onClick={toggleColorCollapse} color="warning">Change Color</Button>
      <Collapse isOpen={colorCollapse}>
      <div>
        <h4>Change Square Color</h4>
        <TwitterPicker onChange={userColor} />
      </div>
      <br />
      <div>
        <h4>DMC to HEX Converter</h4>
        <input type="text" name="dmc_search" placeholder="enter floss color here" value={searchTerm} onChange={handleChange} />
        {searchTerm !== "" ?
          searchResults.map(result => {
            return <> <li>#{result.rgb_code}, {result.description}</li> </>
          })
          : ""}
      </div>
      </Collapse>
      {/* <div>
        <h4>Delete Mode</h4>
        {deleteMode ? "on" : "off"}
        <input type="checkbox" name="deleteMode" onChange={handleChange} />

      </div> */}

      <Button  color={deleteMode ? "danger" : "success"} 
              onClick={() => {
                toggleDelete()
                if(!deleteMode) {
                  setColor("#FFFFFF")
                } else {
                  setColor("#000000")
                }
                }}>
        Delete Mode:
        {deleteMode ? "on" : "off"}
      </Button>


      {/* MODAL TO LET USER SAVE DESIGN */}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader>Save Your Creation!</ModalHeader>
        <ModalBody>
          <input type="text" name="title" placeholder="design name" onChange={onChange} />
          <select name="category_id" onChange={onChange}>
            <option value="0">Select a Category</option>
            {
              categories.map(c => <option value={c.id}>{c.label}</option>)
            }

          </select>
          <label className="publicLabel">Make Design Public</label>
          <input
            onChange={onChange}
            type="checkbox"
            name="public"
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={toggle}>Keep Working</Button>
          <Button onClick={constructPattern}>Save</Button>
        </ModalFooter>
      </Modal>


      <div style={{ width: "900px", overflow: "scroll" }}>
        <Stage
          className="stage"
          opacity={0.9}
          width={gridObj.width}
          height={gridObj.height}
          x={0}
          y={0}
          onClick={e => drawRectangle(e)}
          ref={stageRef}
          style={{ cursor: "crosshair", margin: "3rem" }}>
        </Stage>
      </div>
    </>
  );
}
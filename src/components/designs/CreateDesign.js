import React, { useContext, useEffect, useRef, useState } from "react"
import { useHistory } from "react-router-dom";
import { Modal, ModalBody, ModalFooter, ModalHeader, Collapse, Button } from "reactstrap";
import { Line, Layer, Rect, Group } from "konva";
import { Stage } from 'react-konva';
import { TwitterPicker } from 'react-color';
import { CategoryContext } from "./CategoryProvider";
import { ColorContext } from "./ColorProvider";
import { DesignContext } from "./DesignProvider";
import "./CreateDesign.css"
import CreateIcon from '@material-ui/icons/Create';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';


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
  const [designObj, setDesignObj] = useState({ "public": false })
  const [color, setColor] = useState("#000000")

  // STATE WITH CORRESPONDING TOGGLE
  const [deleteMode, setDeleteMode] = useState(false)
  const toggleDelete = () => setDeleteMode(!deleteMode)

  //MODALS AND COLLAPSES (modal = save pattern) => originally a modal, now a collapse
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
  }, [gridObj])

  //this useEffect updates the search results
  useEffect(() => {
    if (searchTerm !== "" && searchTerm.length >= 3) {
      const results = colors.filter(c => c.floss_number.includes(searchTerm))
      setSearchResults(results);
    }
  }, [searchTerm])


  // SETS THE COLOR OF THE SQUARES
  const userColor = (e) => {
    //grabs the hex from the event
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
  }

  // DMC CONVERTER
  const handleChange = event => {
    const userInput = event.target.value.toLowerCase()
    setSearchTerm(userInput);
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
      <div className="buttonsDiv">
        <Button onClick={() => {
          setDimensionsCollapse(false) // make sure no other collapse is open
          setColorCollapse(false)
          toggle()
        }} color="info" className="createButtons">Save Pattern</Button>
        <Button onClick={() => {
          setDimensionsCollapse(false) // make sure no other collapse is open
          setModal(false)
          toggleColorCollapse()
        }} className="createButtons" color="warning">Change Color</Button>
        <Button onClick={() => {
          setColorCollapse(false) // make sure no other collapse is open
          setModal(false)
          toggleDimensions()
        }}
          className="createButtons" color="primary">Change Dimensions</Button>
        <Button color={deleteMode ? "danger" : "success"}
          className="createButtons"
          onClick={() => {
            toggleDelete()
            if (!deleteMode) {
              setColor("#FFFFFF")
            } else {
              setColor("#000000")
            }
          }}>
          {deleteMode ? <DeleteForeverIcon /> : <CreateIcon />}
        </Button>
      </div>
      <Collapse isOpen={dimensionsCollapse}>
        <div className="dimensionsDiv">
          <h4 className="collapseTitles">Project Width</h4>
          <input className="collapseInputs" type="text" name="width" placeholder="width in inches" value={typeof formGridObj.width === "number" ? formGridObj.width / 224 : formGridObj.width} onChange={onGridChange} />
          <h4 className="collapseTitles">Project Height</h4>
          <input className="collapseInputs" type="text" name="height" placeholder="height in inches" value={typeof formGridObj.height === "number" ? formGridObj.height / 224 : formGridObj.height} onChange={onGridChange} />
          <button className="collapseInputs" onClick={(e) => {
            setGridObj(formGridObj)
            toggleDimensions()
          }}>Change Dimensions</button>
        </div>
      </Collapse>
      <Collapse isOpen={colorCollapse}>
        <div className="colorDiv">
          <div>
            <h4 className="collapseTitles">Change Square Color</h4>
            <TwitterPicker onChange={userColor} />
          </div>
          <br />
          <div>
            <h4 className="collapseTitles">DMC to HEX Converter</h4>
            <input className="collapseInputs" type="text" name="dmc_search" placeholder="enter floss color here" value={searchTerm} onChange={handleChange} />
            {searchTerm !== "" ?
              searchResults.map(result => {
                return <>
                  <li>
                    #{result.rgb_code},
                    <p>
                      {result.description}
                    </p>
                  </li>
                </>
              })
              : ""}
          </div>
        </div>
      </Collapse>
      <Collapse isOpen={modal} toggle={toggle}>
        <div className="saveDiv">
          <h4 className="collapseTitles">Save Your Creation!</h4>
          <form className="saveForm">
            <input className="formInput" type="text" name="title" placeholder="design name" onChange={onChange} />
            <select className="formInput" name="category_id" onChange={onChange}>
              <option value="0">Select a Category</option>
              {
                categories.map(c => <option value={c.id}>{c.label}</option>)
              }
            </select>
            <div className="formInput">
              <label className="publicLabel">Make Design Public</label>
              <input
                className="checkboxPublic"
                onChange={onChange}
                type="checkbox"
                name="public"
              />
            </div>
          </form>
          <Button className="save-btn" color="info" onClick={constructPattern}>Save</Button>
        </div>
      </Collapse>
      <div className="bottomContent">
        <div className="stageDiv"
          style={ //changes div size if user wants a smaller (than default) sized project
            gridObj.height < 700 || gridObj.width < 896 ?
              { height: "448px", width: "448px", overflow: "scroll", background: "white", border:"1px solid black"}
              : { height: "700px", width: "900px", overflow: "scroll", background: "white", border:"1px solid black" }
          }>
          <Stage
            className="stage"
            opacity={0.9}
            width={gridObj.width}
            height={gridObj.height}
            x={0}
            y={0}
            onClick={e => drawRectangle(e)}
            ref={stageRef}
            style={{ cursor: "crosshair" }}>
          </Stage>
        </div>
        <div>
          <h3 className="projectTitle">Project Sizing</h3>
          <p>Project measurements base on 14-count aida cloth</p>
          <p>Current Project Size: {gridObj.width / 224}" x {gridObj.height / 224}" </p>
          <p>Center of project is:
          <br />{(gridObj.width / 2) / 16} squares from the left
          <br />{(gridObj.height / 2) / 16} squares down
        </p>
        </div>
      </div>
    </>
  );
}
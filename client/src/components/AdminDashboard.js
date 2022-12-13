import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import moment from 'moment';
import isEmpty from 'validator/lib/isEmpty';
import { createCategory, getCategories } from '../api/category'
import { createProduct, getProduct, deleteProduct, updateProduct } from '../api/product'
import { showErrorMessage, showSuccessMessage } from '../helpers/message';
import { showLoading } from '../helpers/loading';
import {MdDashboard} from "react-icons/md"
import {getUserBid} from '../api/bid'
import {getLocalStorage} from "../helpers/localStorage"
import Alert from './Alert';
import {CgProfile} from "react-icons/cg"

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [hideshow, setHideShow] = useState(true)
  const [category , setCategory] = useState('')
  const [categories, setCategories] = useState('')
  const [products, setProduct] = useState('')
  const [bidProducts, setBidProducts] = useState('')
  const [used, setUsed] = useState('new');
  const [alert, setAlert] = useState(null);

  const showAlert = (messsage, type) =>{
    setAlert({
      msg: messsage,
      type: type
    })
    setTimeout(() => {
      setAlert(null);
    }, 2000)
  }



  function usedChange(e){
   setUsed(document.getElementById("usedAndNew").value)
  }

  const [productData, setProductData] = useState({
    productImage: null,
    productName: '',
    productDescription: '',
    productPrice: '',
    productCategory: '',
    productQuantity: '',
    year: 'New'
  })



  const {productImage, productName, productDescription, productPrice, productCategory, year} = productData;

  const handleProductImage = (e) => {
    console.log(e.target.files[0])
    setProductData({...productData, productImage: e.target.files[0]})
  }

  const handleProductChange = (e) => {
    setProductData({...productData, [e.target.name]: e.target.value})
  }

  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (productImage === null || isEmpty(productName) || isEmpty(productDescription) || isEmpty(productPrice) || isEmpty(productCategory) || isEmpty(year)) {
      showAlert('Please fill all fields', "danger")
    } else {
      let formData = new FormData();
      formData.append('productImage', productImage);
      formData.append('productName', productName);
      formData.append('productDescription', productDescription);
      formData.append('productPrice', productPrice);
      formData.append('productCategory', productCategory);
      formData.append('year', year);
      console.log([...formData])
      createProduct(formData)
      .then(response => {
        setProductData({
          productImage: null,
          productName: '',
          productDescription: '',
          productPrice: '',
          productCategory: '',
          year: '',
        })
      })
      .catch(err => {
        showAlert(err.response.data.error, "danger")
      })      
    }
    console.log(productData)
  }


  useEffect(() => {
    loadCategories()
  }, [loading])

  const loadCategories = async () => {
    await getCategories()
    .then((response) => {
      setCategories(response.data)
      console.log('categories', response.data)
    }
    )
    .catch((error) => {
      console.log('loadCategories error', error)
    }
    )
  }

  useEffect(() => {
    loadProducts()
  }, [loading])

  const loadProducts = async () => {
    await getProduct()
    .then((response) => {
      setProduct(response.data)
      console.log('products', response.data)
    }
    )
    .catch((error) => {
      console.log('loadProducts error', error)
    }
    )
  }

  useEffect(() => {
    loadBidProducts()
  }, [loading])

  const loadBidProducts = async () => {
    await getUserBid()
    .then((response) => {
      setBidProducts(response.data.bidProducts)
      console.log('products', response.data.bidProducts)
    }
    )
    .catch((error) => {
      console.log('loadProducts error', error)
    }
    )
  }
  const destroy = async (productId) => {
    setLoading(true)
    await deleteProduct(productId)
    .then((response) => {
      setLoading(false)
      console.log('deleteProduct response', response)
    })
    .catch((error) => {
      setLoading(false)
      console.log('deleteProduct error', error)
    })
  }

  const update = async (productId) => {
    setLoading(true)
    await updateProduct(productId)
    .then((response) => {
      setLoading(false)
      console.log('updateProduct response', response)
    })
    .catch((error) => {
      setLoading(false)
      console.log('updateProduct error', error)
    })
  }


  const handleCategoryChange = (e) => {
    setCategory(e.target.value)
    // console.log(category)
  }

  const handleCategorySubmit = (e) => {
    e.preventDefault()
    if (isEmpty(category)) {
      alert('Please enter a category')
    } else {
      const data = { name: category }
      createCategory(data)
        .then(response => {
          setCategory('')
          console.log(response)
        })
        .catch(error => {
          console.log(error)
        })
      }

  }

  function setBid_Products(){
    setHideShow(!hideshow)
  }

  const showHeader = () => (
    <div className="bg-light text-black pl-5 pt-3">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6">
            <h1>
            <i class="fa-solid pl-5" style={{fontFamily: "'Poppins', sans-serif"}}><MdDashboard className='mr-3 rotate'/>Admin Dashboard</i>
            </h1>
          </div>
        </div>
      </div>
    </div>
  )

  const showActionBtns = () => (
    <div className="bg-light my-2">
      <div className="container">
        <div className="row pb3">
          <div className="col-md-4 my-1">
            <button className="btn btn-outline-secondary btn-block" data-toggle='modal' data-target='#addCategoryModal'>
              <i className="fas fa-plus-circle"></i> Create Category
            </button>
          </div>
          <div className="col-md-4 my-1">
            <button className="btn btn-outline-warning btn-block" data-toggle='modal' data-target='#addProductModal' >
              <i className="fas fa-plus-circle"></i> Add Product
            </button>
          </div>
          <div className="col-md-4 my-1">
            <button className="btn btn-outline-success btn-block" onClick={setBid_Products}>
            <i class="fa-sharp fa-solid fa-arrow-up-right-from-square"></i>   {hideshow ? "Your Biding" : "Your Uploads"  }
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const showCategoryModal = () => (
    <div className="modal fade" id="addCategoryModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
        <form onSubmit={handleCategorySubmit}>

          <div className="modal-header bg-info text-white">
            <h5 className="modal-title" id="exampleModalLabel">Add New Category</h5>
            <button type="button" className="close text-white" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
              <div className="form-group">
                <label htmlFor="recipient-name" className="col-form-label" >Category Name:</label>
                <input type="text" className="form-control" id="recipient-name" 
                name='category' 
                value={category} 
                onChange={handleCategoryChange} />
              </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="submit" className="btn btn-primary">Add Category</button>
          </div>

        </form>
        </div>
      </div> 
      
    </div>
  )
let accStatus = getLocalStorage("user").accStatus
function accStatusCheck(){
  console.log("hey")
  if (!accStatus){
    showAlert('Please verify from profile section before you upload any product', "danger")
    return <div></div>
}
else {
  return true
}
}
  const showProductModal = () => (
    <div className="modal fade" id="addProductModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
        <form onSubmit={handleProductSubmit}>
          <div className="modal-header bg-warning text-white">
            <h5 className="modal-title" id="exampleModalLabel">Add New Product</h5>
            <button type="button" className="close text-white" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">

              <div className="form-group mb-3">
                <label htmlFor="recipient-name" className="col-form-label">Upload Image</label>
                <input name='productImage'onChange={handleProductImage} class="form-control" type="file" id="formFile"/>
              </div>

              <div className="form-group">
                <label htmlFor="recipient-name" className="col-form-label">Product Name:</label>
                <input type="text" name='productName' value={productName} onChange={handleProductChange} className="form-control" id="recipient-name" />
              </div>
              <div className="form-group">
                <label htmlFor="recipient-name" className="col-form-label">Product Minimum Bid:</label>
                <div class="input-group mb-3">
                  <span class="input-group-text" id="basic-addon1">₹</span>
                  <input name='productPrice' value={productPrice} onChange={handleProductChange} type="text" className="form-control" aria-label="Username" aria-describedby="basic-addon1"/>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="recipient-name" className="col-form-label">Product Description:</label>
                <textarea name='productDescription' value={productDescription} onChange={handleProductChange} type="text" className="form-control" id="recipient-name" rows = '3' ></textarea>
              </div>
              <div className="form-row" id="recipient-name">
                <div className="form-group col-md-6">
                  <label htmlFor="recipient-name" className="col-form-label">Product Category:</label>
                  <select name='productCategory' onChange={handleProductChange} className="custom-select mr-sm-2">
                    <option value='' selected>Choose Category</option>
                     {
                      categories && categories.map((c, i) => (
                        <option key={i} value={c._id}>{c.name}</option>
                      ))
                     }
                  </select>
                </div>
                <div className="form-group col-md-6">
                <label htmlFor="recipient-name" className="col-form-label">Product Year:</label>
                <select class="form-control" id= "usedAndNew"onChange={usedChange}>
                  <option value="new" >New</option>
                  <option value="old">Old</option>
                </select>
                { used == "old" &&
                <input name='year' value={year} onChange={handleProductChange} type="number" min='1' className="form-control mt-3" id="recipient-name" placeholder='How many years old?'/>}
              </div>
              </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="submit" className="btn btn-primary" >Add Product</button>
          </div>
        </form>
        </div>
      </div>
    </div>
  )

  const showProducts = () => (
    <div className="row">
      <div className="col-md-12">
        <h2 className="text-center">Total {products.length} products</h2>
        <hr />
        { products && products.map((p, i) => (
          <div className="card mb-3" key={i}>
            <div className="row no-gutters">
              <div className="col-md-4">
                <img src= {require(`./uploads/${p.fileName}`)} className="card-img" alt={p.productName} />
              </div>
              <div className="col-md-4">
                <div className="card-body">
                  <h5 className="card-title">{p.productName}</h5>
                  <p className="card-text">{p.productDescription}</p>
                  <p className="card-text"><small className="text-muted">Category: {p.productCategory.name}</small></p>
                  <p className="card-text"><small className="text-muted">year: {p.year}</small></p>
                  {/* <p className="card-text"><small className="text-muted">Minimum Bid: ₹{p.productPrice}</small></p> */}
                  <p className="card-text"><small className="text-muted">Added on: {moment(p.createdAt).fromNow()}</small></p>
                  <p className="card-text"><small className="text-muted">Last updated: {moment(p.updatedAt).fromNow()}</small></p>
                  <Link to={`/admin/product/update/${p._id}`} className="btn btn-outline-warning btn-sm mr-2 scale">Update</Link>
                  <button onClick={() => destroy(p._id)} className="btn btn-outline-danger btn-sm scale">Delete</button>
                </div>
              </div>
              <div className='col-md-4 mt-4'>
                { p.bidder.length>0 ? p.bidder.reverse().map((b, i) => (
                  i<5 &&
                    <div className='d-flex justify-content-between'>
                      <div style={{width: "65px"}}>
                      <span className="mr-3 align-top h2">{i+1}</span>
                      <CgProfile className="text-black h1 float-right" />
                      </div>
                      <p className="ml-3 flex-grow-1 align-self-center h5">Bid Amount: ₹<strong>{b.bidAmount}</strong></p>
                      <div>
                        <button type="button" class="btn btn-outline-success mr-3 scale">Accept</button>
                        <button type="button" class="btn btn-outline-danger mr-3 scale">Reject</button>
                      </div>
                    </div>
                ))
                : <p className='text-black ml-3'>No bidder yet...hope you will soon find a good bidder</p>
                }
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
  const showBidProducts = ()=>(
    <div className="container-fluid pl-5 pt-3 text-center ">
      <div className='row text-center'>
      {bidProducts && bidProducts.map((bidProduct) =>(
        <div className="card text-left mr-5 " style={{width: "28rem"}}>
          <img src={require(`./uploads/${bidProduct.fileName}`)} className="card-img-top w-100" alt="" height="270px"/>
          <div className="card-body pb-2">
            <h5 className="card-title h1">{bidProduct.productName}</h5>
            <p className="card-text text-muted"> Your Bid Amount: <span className='font-weight-bold pl-3'>₹ {bidProduct.bidAmount}</span></p>
            <span className='mr-4 h3 text-muted align-middle'>Status</span><button type="button" class="btn btn-lg btn-outline-warning" disabled>pending</button>
            <p className='pt-3'><Link to={`/singleproduct/${bidProduct.productId}`} className="btn btn-lg scale btn-outline-primary float-left">Change Bid</Link>
            <button type="button" class="btn btn-lg scale btn-outline-danger float-right">Cancel</button></p>
          </div>
        </div>
        ))}
      </div>
    </div>
  )
  return (
    <section>
     <Alert alert={alert}/>
      {showHeader()}
      {showActionBtns()}
      {showCategoryModal()}
      {showProductModal()}
      {hideshow && showProducts()}
      {!hideshow && showBidProducts()}
    </section>
  )
}

export default AdminDashboard
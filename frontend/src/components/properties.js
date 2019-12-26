import React, { Component } from 'react';
class Properties extends Component {
  constructor(props) {
    super(props);
    this.fetchPropertyDetails = this.fetchPropertyDetails.bind(this);
  }
  state = {
    showDescription: false,
    images: []
  };

  fetchPropertyDetails = (e) => {
    const propertyId = e.target.getAttribute('data-item');
    fetch(`http://localhost:4000/images/?propertyId=${propertyId}`)
    .then(res => res.json())
    .then((data) => {
      const result = JSON.parse(data.image);
      this.setState({ images: result });
    })
    .catch(console.log)
    const { showDescription } = this.state;
    this.setState({
        showDescription: !showDescription,
    });
  }
  render() {
    const { showDescription } = this.state;
    return (
         <div>
            {!showDescription && (
                 <div>
                     <table>
                      <thead>
                        <tr>
                          <th>Id</th>
                          <th>Name</th>
                          <th>Address</th>
                          <th>City</th>
                          <th>State</th>
                          <th>Zip Code</th>
                          <th>County</th>
                          <th>Phone</th>
                          <th>Type</th>
                          <th>Capacity</th>
                        </tr>
                      </thead>
                      <tbody>
                          {this.props.properties.map((property, index) => (
                              <tr>
                                  <td>{property.id}</td>
                                  <td key={index} data-item={property.id} onClick={this.fetchPropertyDetails}
                                      style={{ textDecoration: 'underline', color: 'blue' }}
                                  >
                                      {property.name}
                                  </td>
                                  <td>{property.address}</td>
                                  <td>{property.city}</td>
                                  <td>{property.state}</td>
                                  <td>{property.zip_code}</td>
                                  <td>{property.county}</td>
                                  <td>{property.phone}</td>
                                  <td>{property.type}</td>
                                  <td>{property.capacity}</td>

                              </tr>
                            ))}
                       </tbody>
                     </table>
                 </div>
            )}
            {showDescription && (
                <div className={"row"}>
                  {this.state.images.map(image =>
                      <div className={"column"}>
                        <img src={image} />
                      </div>)}
                </div>
            )}
         </div>
    );
  }
}
export default Properties;

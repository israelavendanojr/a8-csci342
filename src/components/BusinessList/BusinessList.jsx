import './BusinessList.css'
import Business from '../Business/Business'


function BusinessList({ businesses }) {
    return (
        <div className='BusinessList'>
            {businesses.map((business, index) => {
                return (
                    <Business 
                        business={business} 
                        key={business.name + index} 
                    />
                );
            })}
        </div>
    );
}

export default BusinessList
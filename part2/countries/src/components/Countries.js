import Country from "./Country";


const Countries = (props) => {

    const showCountry = (country) => {
        props.setFilterCountry(country.name);
    }

    if (typeof props.countries !== "string"){
        if(props.countries.length === 1){
            return <Country key={props.countries[0].name} country={props.countries[0]} />
        }
        return (
            <div>
                {props.countries.map(country =>{
                        return(
                            <div key={country.name}>
                                {country.name}
                                <button onClick={showCountry.bind(this,country)}>
                                    show
                                </button>
                            </div>
                        )
                    }
                )}
            </div>
        )
    }
    return (
        <p>{props.countries}</p>
    )
}

export default Countries
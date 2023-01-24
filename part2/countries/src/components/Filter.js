const Filter = (props) =>
    <div>
        filter shown with:
        <input value={props.filterCountry}
               onChange={props.handleFilterCountry}
        />
    </div>

export default Filter
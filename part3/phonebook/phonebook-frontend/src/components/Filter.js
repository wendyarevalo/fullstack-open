const Filter = (props) =>
    <div>
        filter shown with:
        <input value={props.filterName}
               onChange={props.handleFilterName}
        />
    </div>


export default Filter
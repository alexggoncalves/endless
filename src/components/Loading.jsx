const Loading = ({loadingGif}) => {
    return (
        <div className="loading center">
            <span>Loading</span>
            <img src={loadingGif}></img>
        </div>
    );
};

export default Loading

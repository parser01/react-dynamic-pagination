import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
	const [photos, setPhotos] = useState([]);
	const [isFetching, setIsFetching] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);

	useEffect(() => {
		const fetchPhotos = async () => {
			try {
				const res = await axios.get(
					`https://jsonplaceholder.typicode.com/photos?_limit=10&_page=${currentPage}`
				);
				setPhotos((prevState) => [...prevState, ...res.data]);
				setCurrentPage((prevState) => prevState + 1);
				setTotalCount(res.headers["x-total-count"]);
			} finally {
				setIsFetching(false);
			}
		};

		if (isFetching) {
			fetchPhotos();
		}
	}, [isFetching, currentPage]);

	useEffect(() => {
		const onPageScroll = () => {
			const scrollHeight = Math.max(
				document.body.scrollHeight,
				document.documentElement.scrollHeight,
				document.body.offsetHeight,
				document.documentElement.offsetHeight,
				document.body.clientHeight,
				document.documentElement.clientHeight
			);

			if (
				scrollHeight <
					document.documentElement.clientHeight + window.scrollY + 100 &&
				photos.length < totalCount
			) {
				setIsFetching(true);
			}
		};

		window.addEventListener("scroll", onPageScroll);

		return () => {
			window.removeEventListener("scroll", onPageScroll);
		};
	}, [photos.length, totalCount]);

	return (
		<div className="app">
			<div className="photos">
				{photos.map((photo) => (
					<div className="photo" key={photo.id}>
						<div className="photo__image">
							<img src={photo.thumbnailUrl} alt={photo.title} />
						</div>
						<div className="photo__title">
							{photo.id}. {photo.title}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default App;

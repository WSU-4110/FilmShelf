import React, { useEffect, useState } from "react";
import { NavBar } from "../../nav/nav";
import { auth, db } from '../../../config/firebase-config';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import SearchBarForListPage from '../../search/SearchBarForListPage';
import './listPage.css';

export default function UserLists() {
    const [userLists, setUserLists] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [listName, setListName] = useState('');
    const [newListName, setNewListName] = useState(''); // Editable list title in the modal
    const [description, setDescription] = useState('');
    const [newListMovies, setNewListMovies] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const apiKey = import.meta.env.VITE_TMDB_API;

    const openModal = (edit = false) => {
        setIsEditing(edit);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setListName('');
        setNewListName('');
        setDescription('');
        setNewListMovies([]);
        setIsEditing(false);
    };

    const getUserLists = async () => {
        const uid = auth.currentUser?.uid;
        if (uid) {
            const userRef = doc(db, "users", uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                setUserLists(userSnap.data().lists || {});
            }
        }
    };

    const saveList = async () => {
        const uid = auth.currentUser?.uid;
        if (uid && newListName) {
            const userRef = doc(db, "users", uid);
            const listData = {
                name: newListName,
                description,
                movies: newListMovies.map(movie => movie.id),
            };

            const updatedLists = { ...userLists };
            if (listName !== newListName) {
                delete updatedLists[listName];
            }
            updatedLists[newListName] = listData;

            await updateDoc(userRef, { lists: updatedLists });
            closeModal();
            getUserLists();
        }
    };

    const deleteList = async () => {
        if (window.confirm(`Are you sure you want to delete the list "${listName}"? This action cannot be undone.`)) {
            const uid = auth.currentUser?.uid;
            if (uid) {
                const userRef = doc(db, "users", uid);
                const updatedLists = { ...userLists };
                delete updatedLists[listName];
                await updateDoc(userRef, { lists: updatedLists });
                closeModal();
                getUserLists();
            }
        }
    };

    const addMovieToList = (movie) => {
        if (!newListMovies.find(m => m.id === movie.id)) {
            setNewListMovies([...newListMovies, movie]);
        }
    };

    const removeMovieFromList = (movieId) => {
        setNewListMovies(newListMovies.filter(movie => movie.id !== movieId));
    };

    const openEditModal = async (listName) => {
        const list = userLists[listName];
        setListName(listName);
        setNewListName(list.name);
        setDescription(list.description);

        const movies = await fetchMoviesByIds(list.movies);
        setNewListMovies(movies);
        openModal(true);
    };

    const fetchMoviesByIds = async (movieIds) => {
        const moviesPromises = movieIds.map((movieId) =>
            fetch(
                `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`
            ).then((res) => res.json())
        );
        return await Promise.all(moviesPromises);
    };

    const moveMovieUp = (index) => {
        if (index === 0) return;
        const newOrder = [...newListMovies];
        [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
        setNewListMovies(newOrder);
    };

    const moveMovieDown = (index) => {
        if (index === newListMovies.length - 1) return;
        const newOrder = [...newListMovies];
        [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
        setNewListMovies(newOrder);
    };

    const handleMovieClick = (movie) => {
        setSelectedMovie(movie);
    };

    const closeMoviePopUp = () => {
        setSelectedMovie(null);
    };

    useEffect(() => {
        getUserLists();
    }, []);

    return (
        <>
            <NavBar />
            <div className="content">
                <button className="add-list-button" onClick={() => openModal(false)}>Add List</button>
                <div className="lists-container">
                    {Object.keys(userLists).map((listName) => (
                        <ListSection
                            key={listName}
                            listName={listName}
                            listData={userLists[listName]}
                            apiKey={apiKey}
                            onEdit={() => openEditModal(listName)}
                            onMovieClick={handleMovieClick}
                        />
                    ))}
                </div>

                {isModalOpen && (
    <div className="list-modal">
        <div className="list-modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>{isEditing ? "Edit List" : "Create New List"}</h2>
            <input
                type="text"
                placeholder="List Name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
            />
            <textarea
                placeholder="Optional Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <SearchBarForListPage onAddMovie={addMovieToList} />

            <div className="movie-grid">
                {newListMovies.map((movie, index) => (
                    <div key={movie.id} className="movie-item">
                        <img
                            src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                            alt={movie.title}
                            className="movie-thumbnail"
                        />
                        <span className="movie-rank">Rank: {index + 1}</span>
                        <div className="rank-buttons">
                            <button onClick={() => moveMovieUp(index)}>Up</button>
                            <button onClick={() => moveMovieDown(index)}>Down</button>
                        </div>
                        <button onClick={() => removeMovieFromList(movie.id)}>Remove</button>
                    </div>
                ))}
            </div>

            <div className="list-modal-buttons">
                <button className="save-button" onClick={saveList}>Save List</button>
                {isEditing && (
                    <button className="delete-button" onClick={deleteList}>Delete List</button>
                )}
            </div>
        </div>
    </div>
)}


                {/* Movie Pop-Up */}
                {selectedMovie && (
                    <div className="list-modal" onClick={closeMoviePopUp}>
                        <div className="list-modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="list-modal-body">
                                <img
                                    className="list-modal-poster"
                                    src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2${selectedMovie.poster_path}`}
                                    alt={selectedMovie.title}
                                />
                                <div className="list-modal-info">
                                    <h2>{selectedMovie.title}</h2>
                                    <p>{selectedMovie.overview}</p>
                                    <button className="close" onClick={closeMoviePopUp}>&times;</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

function ListSection({ listName, listData, apiKey, onEdit, onMovieClick }) {
    const [movies, setMovies] = useState([]);

    const fetchMovies = async () => {
        const moviesPromises = listData.movies.map((movieId) =>
            fetch(
                `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`
            ).then((res) => res.json())
        );
        const moviesData = await Promise.all(moviesPromises);
        setMovies(moviesData);
    };

    useEffect(() => {
        fetchMovies();
    }, [listData.movies]);

    return (
        <div className="list-section">
            <div className="list-header">
                <h3>{listData.name}</h3>
                <button className="edit-button" onClick={onEdit}>Edit List</button>
            </div>
            <p className="list-description">{listData.description}</p>
            <div className="movie-row">
                {movies.map((movie) => (
                    <div key={movie.id} className="movie-item" onClick={() => onMovieClick(movie)}>
                        <img
                            src={`https://image.tmdb.org/t/p/w154${movie.poster_path}`}
                            alt={movie.title}
                            className="movie-thumbnail-small"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

import { Checkbox, ListItemText, TextField, withStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import CardActions from '@mui/material/CardActions';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";


const styles = (theme) => ({
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 240,
        maxWidth: 240,
    },
    cardTitle: {
        color: theme.palette.primary.light,
        textTransform: 'uppercase',
        fontSize: 14,
        margin: 'auto'
    }
});

function FilterCard(props) {
    const { classes } = props;

    // states and handler function to manage genres drop down
    const [genres, setGenres] = useState([]);
    const [genre, setGenre] = useState([]);
    const genreChangeListener = (event) => {
        setGenre(event.target.value)
    };

    // states and handler function to manage artists drop down
    const [artists, setArtists] = useState([]);
    const [artist, setArtist] = useState([]);
    const artistsChangeListener = (event) => {
        setArtist(event.target.value)
    };


    useEffect(() => {
        getGenres();
        getArtists();
    }, [])

    const getGenres = async () => {
        try {
            const rawResponse = await fetch('http://localhost:8085/api/v1/genres', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                    "Accept": "application/json;charset=UTF-8",
                },
            })

            const response = await rawResponse.json()

            if (rawResponse.ok) {
                setGenres(response.genres);
            } else {
                throw (new Error(response.message || 'Something went wrong!'))
            }
        } catch (e) {
            alert(`Error: ${e.message}`);
        }
    }

    const getArtists = async () => {
        try {
            const rawResponse = await fetch('http://localhost:8085/api/v1/artists?limit=20', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                    "Accept": "application/json;charset=UTF-8",
                },
            })

            const response = await rawResponse.json()

            if (rawResponse.ok) {
                setArtists(response.artists);
            } else {
                throw (new Error(response.message || 'Something went wrong!'))
            }
        } catch (e) {
            alert(`Error: ${e.message}`);
        }
    }


    const applyFilterHandler = () => {
        console.log(genre)

        let paramGenre = '';

        for (let i = 0; i < genre.length; i++) {
            if (genre.length === i + 1) {
                paramGenre += genre[i]['genre']
            } else {
                paramGenre += genre[i]['genre'] + ','
            }
        }

        let paramArtist = '';

        for (let i = 0; i < artist.length; i++) {
            if (artist.length === i + 1) {
                paramArtist += artist[i]['first_name'] + ' ' + artist[i]['last_name']
            } else {
                paramArtist += artist[i]['first_name'] + ' ' + artist[i]['last_name'] + ','
            }
        }

        const params = {
            'title': movie,
            'genres': paramGenre,
            'artists': paramArtist,
            'startDate': startDate,
            'endDate': endDate
        }
        props.setFilterParam(params)
    }

    const [movie, setMovie] = useState('')
    const onMovieNameChanged = (e) => {
        setMovie(e.target.value)
    }


    const [startDate, setStartDate] = useState('')
    const onStartDateChanged = (e) => {
        setStartDate(e.target.value)
    }

    const [endDate, setEndDate] = useState('')
    const onEndDateChanged = (e) => {
        setEndDate(e.target.value)
    }


    return (
        <Card sx={{ margin: 'auto' }}>
            <CardContent>
                <div className={classes.formControl} >
                    <h5 className={classes.cardTitle} >Find Movies By:</h5>
                </div>

                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="movies-name">Movies Name</InputLabel>
                    <Input id="movies-name" value={props.movie} onChange={onMovieNameChanged} />
                </FormControl>

                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="genres">Genres</InputLabel>
                    <Select
                        multiple
                        renderValue={(selected) => selected.map((x) => x.genre).join(', ')}
                        value={genre}
                        onChange={genreChangeListener}>                            
                        {
                            genres.map((item) => (
                                <MenuItem key={"genre:" + item.id} value={item}>
                                    <Checkbox checked={
                                        genre.findIndex((i) => i.id === item.id) >= 0
                                    } />
                                    <ListItemText primary={item.genre} />
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>

                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="artists">Artists</InputLabel>
                    <Select
                        multiple
                        renderValue={(selected) => selected.map((x) => x.first_name + " " + x.last_name).join(', ')}
                        value={artist}
                        onChange={artistsChangeListener}>
                        {
                            artists.map((item) => (
                                <MenuItem key={"artists" + item.id} value={item}>
                                    <Checkbox checked={
                                        artist.findIndex((i) => i.id === item.id) >= 0
                                    }
                                    />
                                    <ListItemText primary={item.first_name + " " + item.last_name} />
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>

                <FormControl className={classes.formControl}>
                    <TextField
                        label="Release Date Start"
                        type="date"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={startDate}
                        onChange={onStartDateChanged}
                    />
                </FormControl>

                <FormControl className={classes.formControl}>
                    <TextField
                        label="Release Date End"
                        type="date"                       
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={endDate? "dd-mm-yyyy": endDate}
                        onChange={onEndDateChanged}
                    />
                </FormControl>


            </CardContent>

            <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                <FormControl className={classes.formControl}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={applyFilterHandler}
                    >
                        Apply
                    </Button>
                </FormControl>
            </CardActions>
        </Card >
    )
}

export default withStyles(styles)(FilterCard);
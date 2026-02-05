import { useState, useContext, useEffect } from 'react';
import {
    Checkbox,
    FormControl, FormControlLabel, FormGroup,
    TextField,
    Select,
    MenuItem,
    InputLabel, Grid2,
    FormLabel,
    RadioGroup, Radio,
    Typography,
    FormHelperText,

} from "@mui/material";
import {
    doI18n,
    getAndSetJson,
    getJson,
} from "pithekos-lib";
import sx from "../../pages/Selection.styles";
import ListMenuItem from "../../pages/ListMenuItem";
import { i18nContext } from 'pankosmia-rcl';
export default function ContentDocument({ open, contentOption, setContentOption, versification, setVersification, bookCode, setBookCode, bookAbbr, setBookAbbr, bookCodes, bookTitle, setBookTitle}) {
    const { i18nRef } = useContext(i18nContext);
    const [protestantOnly, setProtestantOnly] = useState(true);
    const [versificationCodes, setVersificationCodes] = useState([]);
    const [clientConfig, setClientConfig] = useState({});

    useEffect(() => {
        getJson('/client-config')
            .then((res) => res.json)
            .then((data) => setClientConfig(data))
            .catch((err) => console.error('Error :', err));
    }, []);
    const isProtestantBooksOnlyCheckboxEnabled =
        clientConfig?.['core-contenthandler_bcv']
            ?.find((section) => section.id === 'config')
            ?.fields?.find((field) => field.id === 'protestantBooksOnlyCheckbox')?.value !== false;

    const isProtestantBooksOnlyDefaultChecked =
        clientConfig?.['core-contenthandler_bcv']
            ?.find((section) => section.id === 'config')
            ?.fields?.find((field) => field.id === 'protestantBooksOnlyDefaultChecked')?.value !== false;

    useEffect(() => {
        setProtestantOnly(isProtestantBooksOnlyDefaultChecked);
    }, [isProtestantBooksOnlyDefaultChecked]);

    useEffect(() => {
        if (open) {
            getAndSetJson({
                url: "/content-utils/versifications",
                setter: setVersificationCodes
            }).then()
        }
    },
        [open]
    );
    return (
        <>
            <FormControl sx={{ width: "100%" }}>
                <InputLabel
                    id="booksVersification-label"
                    required
                    htmlFor="booksVersification"
                    sx={sx.inputLabel}>
                    {doI18n("pages:core-contenthandler_bcv:versification_scheme", i18nRef.current)}
                </InputLabel>
                <Select
                    variant="outlined"
                    required
                    labelId="booksVersification-label"
                    name="booksVersification"
                    inputProps={{
                        id: "bookVersification",
                    }}
                    value={versification}
                    label={doI18n("pages:core-contenthandler_bcv:versification_scheme", i18nRef.current)}
                    onChange={(event) => {
                        setVersification(event.target.value);
                    }}
                    sx={sx.select}
                >
                    {
                        versificationCodes.map((listItem, n) => <MenuItem key={n} value={listItem}
                            dense>
                            <ListMenuItem
                                listItem={`${listItem.toUpperCase()} - ${doI18n(`scripture:versifications:${listItem}`, i18nRef.current)}`}
                            />
                        </MenuItem>
                        )
                    }
                </Select>
                <FormHelperText> {doI18n(`pages:core-contenthandler_bcv:helper_versification`, i18nRef.current)}</FormHelperText>
            </FormControl>

            <FormControl>
                <FormLabel
                    id="book-create-options">
                    {doI18n("pages:core-contenthandler_bcv:add_content", i18nRef.current)}
                </FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="book-create-options"
                    name="book-create-options-radio-group"
                    value={contentOption}
                    onChange={event => setContentOption(event.target.value)}
                >
                    <FormControlLabel value="none" control={<Radio />}
                        label={doI18n("pages:core-contenthandler_bcv:no_content_radio", i18nRef.current)} />
                    <FormControlLabel value="book" control={<Radio />}
                        label={doI18n("pages:core-contenthandler_bcv:book_content_radio", i18nRef.current)} />
                </RadioGroup>
            </FormControl>
            <Typography sx={{ padding: 1 }}>{contentOption === "book" && `${doI18n("pages:core-contenthandler_bcv:helper_book", i18nRef.current)}`}</Typography>
            {
                (contentOption === "book") && <>
                    <Grid2 container spacing={1} justifyItems="flex-end" alignItems="stretch">
                        <Grid2 item size={4}>
                            <FormControl sx={{ width: "100%" }}>
                                <InputLabel id="bookCode-label" required htmlFor="bookCode" sx={sx.inputLabel}>
                                    {doI18n("pages:core-contenthandler_bcv:book_code", i18nRef.current)}
                                </InputLabel>
                                <Select
                                    variant="outlined"
                                    labelId="bookCode-label"
                                    name="bookCode"
                                    inputProps={{
                                        id: "bookCode",
                                    }}
                                    value={bookCode}
                                    label={doI18n("pages:core-contenthandler_bcv:book_code", i18nRef.current)}
                                    onChange={(event) => {
                                        setBookCode(event.target.value);
                                        setBookAbbr(
                                            ["1", "2", "3"].includes(event.target.value[0]) ?
                                                event.target.value.slice(0, 2) + event.target.value[2].toLowerCase() :
                                                event.target.value[0] + event.target.value.slice(1).toLowerCase()
                                        );
                                        setBookTitle(doI18n(`scripture:books:${event.target.value}`, i18nRef.current))
                                    }}
                                    sx={sx.select}
                                >
                                    {
                                        (protestantOnly ? bookCodes.slice(0, 66) : bookCodes).map((listItem, n) =>
                                            <MenuItem key={n} value={listItem} dense>
                                                <ListMenuItem
                                                    listItem={`${listItem} - ${doI18n(`scripture:books:${listItem}`, i18nRef.current)}`} />
                                            </MenuItem>
                                        )
                                    }
                                </Select>
                            </FormControl>

                        </Grid2>
                        <Grid2 item size={4}>
                            <TextField
                                id="bookAbbr"
                                required
                                sx={{ width: "100%" }}
                                label={doI18n("pages:core-contenthandler_bcv:book_abbr", i18nRef.current)}
                                value={bookAbbr}
                                onChange={(event) => {
                                    setBookAbbr(event.target.value);
                                }}
                            />
                        </Grid2>
                        <Grid2 item size={4}>
                            <TextField
                                id="bookTitle"
                                required
                                sx={{ width: "100%" }}
                                label={doI18n("pages:core-contenthandler_bcv:book_title", i18nRef.current)}
                                value={bookTitle}
                                onChange={(event) => {
                                    setBookTitle(event.target.value);
                                }}
                            />
                        </Grid2>
                        {isProtestantBooksOnlyCheckboxEnabled && (
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            color='secondary'
                                            checked={protestantOnly}
                                            onChange={() => setProtestantOnly(!protestantOnly)}
                                        />
                                    }
                                    label={doI18n("pages:core-contenthandler_bcv:protestant_books_only", i18nRef.current)}
                                />
                            </FormGroup>
                        )}
                    </Grid2>
                </>
            }
        </>
    );
}
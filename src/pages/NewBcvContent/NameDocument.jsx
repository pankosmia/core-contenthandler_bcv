import { Grid2, TextField, Tooltip } from "@mui/material";
import { doI18n } from "pithekos-lib";
import { useContext } from "react";
import { i18nContext } from "pankosmia-rcl";

export default function NameDocument({ repoExists, setRepoExists, contentName, setContentName, contentAbbr, setContentAbbr, localRepos, contentType, setContentType, errorAbbreviation, setErrorAbbreviation }) {

    const { i18nRef } = useContext(i18nContext)
    const regexAbbreviation = /^[A-Za-z0-9][A-Za-z0-9_]{0,6}[A-Za-z0-9]$/

    return (
        <>
            <Grid2
                container
                spacing={2}
                justifyItems="flex-end"
                alignItems="stretch"
                flexDirection={"column"}
            >
                <TextField
                    id="name"
                    required
                    label={doI18n("pages:core-contenthandler_bcv:name", i18nRef.current)}
                    value={contentName}
                    onChange={(event) => {
                        setContentName(event.target.value);
                    }}
                />
                <Tooltip
                    open={repoExists}
                    slotProps={{ popper: { modifiers: [{ name: 'offset', options: { offset: [0, -7] } }] } }}
                    title={doI18n("pages:core-contenthandler_bcv:name_is_taken", i18nRef.current)} placement="top-start"
                >
                    <TextField
                        id="abbr"
                        error={errorAbbreviation}
                        helperText={`${doI18n("pages:core-contenthandler_bcv:helper_abbreviation", i18nRef.current)}`}
                        required
                        label={doI18n("pages:core-contenthandler_bcv:abbreviation", i18nRef.current)}
                        value={contentAbbr}
                        onChange={(event) => {
                            const value = event.target.value
                            setRepoExists(localRepos.map(l => l.split("/")[2]).includes(value));
                            setContentAbbr(value);
                            setErrorAbbreviation(!regexAbbreviation.test(value))
                        }}
                    />
                </Tooltip>
            </Grid2>
            <TextField
                id="type"
                required
                disabled={true}
                sx={{ display: "none" }}
                label={doI18n("pages:core-contenthandler_bcv:type", i18nRef.current)}
                value={contentType}
                onChange={(event) => {
                    setContentType(event.target.value);
                }}
            />
        </>
    );
}
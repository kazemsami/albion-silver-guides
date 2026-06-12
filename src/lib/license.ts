export const copyrightHolder = "Kazem Abou Setta";
export const copyrightYear = 2026;
export const programName = "Albion Silver";

/** SPDX identifier — matches package.json "license" field. */
export const licenseSpdxId = "GPL-3.0-or-later";

export const licenseName = "GNU General Public License v3.0 or later";
export const gplLicenseUrl = "https://www.gnu.org/licenses/gpl-3.0.html";

/** Redistribution terms and warranty disclaimer (footer, README, /license). */
export const licenseGrant =
  "You may redistribute and modify it under those terms. There is no warranty.";

/** Full user-facing license summary without the copyright line. */
export const licenseSummary = `This project is free software licensed under the ${licenseName}. ${licenseGrant}`;

/**
 * GPL-recommended program notice. The repository LICENSE file contains the
 * complete GPLv3 text published by the Free Software Foundation.
 */
export const licenseShortNotice = `${programName}
Copyright (C) ${copyrightYear} ${copyrightHolder}

This program is free software: you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program. If not, see ${gplLicenseUrl}.`;

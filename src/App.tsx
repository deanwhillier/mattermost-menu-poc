import {useState} from 'react';

import IconButton from './components/icon-button';
import Menu from './components/menu';
import MenuPanel from './components/menu/menu-panel';
import MenuHeader from './components/menu/menu-header';
import MenuGroup from './components/menu/menu-group';
import MenuItem from './components/menu/menu-item';

function App() {
    const [menuIsOpen, setMenuIsOpen] = useState(false);

    return (
        <div className='App'>
            <IconButton glyph='icon-menu' active={menuIsOpen} onClick={() => setMenuIsOpen(!menuIsOpen)} />
            <Menu open={menuIsOpen} onClose={() => setMenuIsOpen(false)}>
                <MenuPanel id='Menu_UXDesign' open={true} active={true}>
                    <MenuHeader>UX Design</MenuHeader>
                    <MenuGroup>
                        <MenuItem iconGlyph='icon-information-outline'>View Info</MenuItem>
                        <MenuItem iconGlyph='icon-pencil-outline'>Edit Channel</MenuItem>
                        <MenuItem iconGlyph='icon-link-variant'>Copy Link</MenuItem>
                        <MenuItem>No Icon</MenuItem>
                    </MenuGroup>
                    <MenuGroup>
                        <MenuItem iconGlyph='icon-folder-move-outline' menuPanelID='Menu_UXDesign_MoveTo'>
                            Move To
                        </MenuItem>
                    </MenuGroup>
                    <MenuGroup>
                        <MenuItem iconGlyph='icon-bell-outline'>Navigation Preferences</MenuItem>
                        <MenuItem iconGlyph='icon-bell-off-outline'>Mute Channel</MenuItem>
                        <MenuItem iconGlyph='icon-star-outline'>Favorite</MenuItem>
                    </MenuGroup>
                    <MenuGroup>
                        <MenuItem iconGlyph='icon-account-multiple-outline'>Members</MenuItem>
                        <MenuItem iconGlyph='icon-pin-outline'>Pinned Messages</MenuItem>
                        <MenuItem iconGlyph='icon-file-text-outline'>Files</MenuItem>
                    </MenuGroup>
                    <MenuGroup>
                        <MenuItem iconGlyph='icon-exit-to-app' destructive>
                            Leave Channel
                        </MenuItem>
                        <MenuItem iconGlyph='icon-trash-can-outline' destructive>
                            Archive Channel
                        </MenuItem>
                    </MenuGroup>
                </MenuPanel>
                <MenuPanel id='Menu_UXDesign_MoveTo'>
                    <MenuHeader enableBackButton={true}>Move To</MenuHeader>
                    <MenuGroup>
                        <MenuItem iconGlyph='icon-star-outline'>Favorites</MenuItem>
                        <MenuItem iconGlyph='icon-folder-outline'>Active Projects</MenuItem>
                        <MenuItem iconGlyph='icon-folder-outline'>UX</MenuItem>
                        <MenuItem iconGlyph='icon-folder-outline'>Release</MenuItem>
                        <MenuItem iconGlyph='icon-folder-outline'>Design Team</MenuItem>
                        <MenuItem iconGlyph='icon-folder-outline'>Frequent DMs</MenuItem>
                        <MenuItem iconGlyph='icon-folder-outline'>Bots</MenuItem>
                        <MenuItem iconGlyph='icon-folder-outline'>Auditions</MenuItem>
                        <MenuItem iconGlyph='icon-folder-outline'>Channels</MenuItem>
                    </MenuGroup>
                    <MenuGroup>
                        <MenuItem
                            iconGlyph='icon-folder-move-outline'
                            menuPanelID='Menu_UXDesign_MoveTo_AnotherSubMenu'
                        >
                            Another Sub Menu
                        </MenuItem>
                    </MenuGroup>
                    <MenuGroup>
                        <MenuItem
                            iconGlyph='icon-folder-move-outline'
                            menuPanelID='Menu_UXDesign_MoveTo_YetAnotherSubMenu'
                        >
                            Yet Another Sub Menu
                        </MenuItem>
                    </MenuGroup>
                </MenuPanel>
                <MenuPanel id='Menu_UXDesign_MoveTo_AnotherSubMenu'>
                    <MenuHeader enableBackButton={true}>Another Sub Menu</MenuHeader>
                    <MenuGroup>
                        <MenuItem iconGlyph='icon-folder-outline'>Menu Item</MenuItem>
                        <MenuItem iconGlyph='icon-folder-outline'>Menu Item</MenuItem>
                        <MenuItem iconGlyph='icon-folder-outline'>Menu Item</MenuItem>
                        <MenuItem iconGlyph='icon-folder-outline'>Menu Item</MenuItem>
                        <MenuItem iconGlyph='icon-folder-outline'>Menu Item</MenuItem>
                        <MenuItem iconGlyph='icon-folder-outline'>Menu Item</MenuItem>
                        <MenuItem iconGlyph='icon-folder-outline'>Menu Item</MenuItem>
                        <MenuItem iconGlyph='icon-folder-outline'>Menu Item</MenuItem>
                        <MenuItem iconGlyph='icon-folder-outline'>Menu Item</MenuItem>
                        <MenuItem iconGlyph='icon-folder-outline'>Menu Item</MenuItem>
                        <MenuItem iconGlyph='icon-folder-outline'>Menu Item</MenuItem>
                        <MenuItem iconGlyph='icon-folder-outline'>Menu Item</MenuItem>
                        <MenuItem iconGlyph='icon-folder-outline'>Menu Item</MenuItem>
                        <MenuItem iconGlyph='icon-folder-outline'>Menu Item</MenuItem>
                        <MenuItem iconGlyph='icon-folder-outline'>Menu Item</MenuItem>
                        <MenuItem iconGlyph='icon-folder-outline'>Menu Item</MenuItem>
                        <MenuItem iconGlyph='icon-folder-outline'>Menu Item</MenuItem>
                        <MenuItem iconGlyph='icon-folder-outline'>Menu Item</MenuItem>
                        <MenuItem iconGlyph='icon-folder-outline'>Menu Item</MenuItem>
                        <MenuItem iconGlyph='icon-folder-outline'>Menu Item</MenuItem>
                        <MenuItem iconGlyph='icon-folder-outline'>Menu Item</MenuItem>
                    </MenuGroup>
                </MenuPanel>
                <MenuPanel id='Menu_UXDesign_MoveTo_YetAnotherSubMenu'>
                    <MenuHeader enableBackButton={true}>Yet Another Sub Menu</MenuHeader>
                    <MenuGroup>
                        <MenuItem iconGlyph='icon-folder-outline'>Menu Item 2</MenuItem>
                        <MenuItem iconGlyph='icon-folder-outline'>Menu Item 2</MenuItem>
                        <MenuItem iconGlyph='icon-folder-outline'>Menu Item 2</MenuItem>
                        <MenuItem iconGlyph='icon-folder-outline'>Menu Item 2</MenuItem>
                        <MenuItem iconGlyph='icon-folder-outline'>Menu Item 2</MenuItem>
                        <MenuItem iconGlyph='icon-folder-outline'>Menu Item 2</MenuItem>
                        <MenuItem iconGlyph='icon-folder-outline'>Menu Item 2</MenuItem>
                        <MenuItem iconGlyph='icon-folder-outline'>Menu Item 2</MenuItem>
                        <MenuItem iconGlyph='icon-folder-outline'>Menu Item 2</MenuItem>
                        <MenuItem iconGlyph='icon-folder-outline'>Menu Item 2</MenuItem>
                        <MenuItem iconGlyph='icon-folder-outline'>Menu Item 2</MenuItem>
                    </MenuGroup>
                </MenuPanel>
            </Menu>
        </div>
    );
}

export default App;

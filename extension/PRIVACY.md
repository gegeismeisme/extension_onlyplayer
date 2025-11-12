# OnlyPlayer Privacy Statement / 隐私条款

> Last updated: 2025-11-11  
> 本文件将随着功能迭代而更新

---

## 1. Scope 范围
OnlyPlayer 是一款浏览器扩展，帮助您在浏览器内播放本地音视频文件。本隐私条款适用于该扩展的全部功能以及未来的更新。

## 2. Data We Handle 处理的数据
| 数据类型 | 用途 | 保留方式 |
| --- | --- | --- |
| **Local file metadata 本地文件元数据**（文件名、扩展名、大小、最近播放时间） | 构建播放列表、在界面显示 | 仅存于浏览器内存，关闭标签后即清除 |
| **文件夹访问句柄 Folder handles**（用户通过 File System Access API 选择的目录引用） | 允许您重新打开已授权的媒体目录 | 存储在浏览器 IndexedDB / storage 中，未经您的再次授权不会访问其他路径 |
| **播放偏好 Playback preferences**（音量、倍速、循环模式、主题等） | 记住您的播放设置 | 保存在浏览器本地 IndexedDB 或 `chrome.storage.local` |

我们不会读取或上传媒体文件内容，所有解码与播放都在您的设备本地完成。

## 3. Network Usage 网络使用
OnlyPlayer 不会主动向开发者或第三方服务器发送任何媒体或个人数据。只有在您手动触发更新（如 Chrome 网上应用店自动检查更新）时，浏览器自身会与相关商店对接，这不由扩展控制。

## 4. Permissions & APIs 权限与 API
- **File System Access API**：用于读取您手动选择的文件夹。首次访问需要您的确认，您可随时在浏览器设置中撤销授权。  
- **IndexedDB / Storage**：仅用于缓存上述偏好与目录句柄。  
- **Media Session / Picture-in-Picture API**：提升播放体验，不会传输数据。

扩展不会请求额外的网络权限、剪贴板权限或可识别个人身份的信息。

## 5. Third-Party Services 第三方服务
当前版本未内嵌第三方分析、广告或追踪脚本。如未来需要集成（例如可选云同步），我们将在更新前征求您的同意并在本条款中明确说明。

## 6. Children’s Privacy 未成年人隐私
OnlyPlayer 面向通用用户，不针对 13 岁以下儿童设计或营销。若您认为我们错误地存储了未成年人的数据，请通过下文方式联系我们，我们会立即删除相关记录。

## 7. Your Controls 用户控制
- 通过浏览器设置/权限管理界面撤销目录访问授权；  
- 清除浏览器的站点数据即可删除所有本地缓存；  
- 通过扩展设置重置播放偏好。

## 8. Changes to This Policy 条款更新
我们可能在发布新功能时更新本隐私条款，请留意版本日期。重大变更将在扩展更新日志或官方发布渠道中提示。

## 9. Contact 联系方式
如对隐私或数据使用有任何疑问，可发送邮件至 `onlyplayer-support@example.com`（请替换为实际联系邮箱）。我们将于 30 日内回复。

---

若本条款的中英文本存在歧义，以中文版为准。 നന്ദി!

---
layout: post
title: 译：什么是「现代」编程？
---

注：经作者 [Daniel Lemire](https://lemire.me/en/) [授权](https://lemire.me/blog/2017/07/15/what-is-modern-programming/#comment-285759)翻译发布。原文： [What is “modern” programming?](https://lemire.me/blog/2017/07/15/what-is-modern-programming/)

******

年轻的时候我接触了 BASIC 和汇编，然后是更正经的 Turbo Pascal，让我感慨「这才是编程」。[Turbo Pascal 提供了最早的集成编程环境 (Integrated Development Environment, IDE) 之一](https://photos.app.goo.gl/WcxNIutwtWmFTdzL2)——顾名思义，IDE 为程序员提供了写代码、编译、运行和 debug 的整套环境。Turbo Pascal 并没有很多的图形界面（它基于纯文本），但有简单的菜单和窗口。你可以进入 debug 模式，跟踪变量值的变化，等等。

然后我接触了 [Delphi](https://photos.app.goo.gl/QnCWPHDcp4Drzev12)（即带图形界面的 Turbo Pascal），它的 IDE 即使到今天看起来还是不错的。我也简单玩了玩 [Visual Basic](https://www.youtube.com/watch?v=TgIrzFqGIKM)， 在 Windows 3.1 上捣鼓出了一个会报时的钟并发布到了某个论坛。然后我遇见了 Visual Studio...这几年来它一直是我 C++ 编程的参考。所以你看，IDE 一直都在。

[Smalltalk 早在80年代初就以发布了很强大的图形界面 IDE 闻名。](https://www.youtube.com/watch?v=e0LfndNxqZg)

我想说的是，使用 IDE 并不「现代」——我们对它的使用跟以前差不多。我们编程的东西变了，但在很多情况下我们编程的方式并没有变。在我的 Dell 笔记本上有最新的 Visual Studio，但20年前的我大概可以同样流畅的使用它。Debug，自动补全，代码执行...都没什么变化。我甚至沮丧于 Visual Studio 跟 Turbo Pascal 一直很像，总觉得在这方面我们应该有更长足的进展。

现代编程和桌面系统长什么样子没关系。GUI (Graphical User Interfaces) 是表象，而现代编程的技巧在于背后的过程和工具。我并不关心你用 Eclipse 还是 Emacs，它们并不能告诉我你有多「现代」。

所以在编程这个语境下，什么是「现代」？

- 写程序的社交性大大提高。20年前在一个组织内大家统一 IDE 并完全依赖它来编译、测试、部署代码并没什么错。组织以外其他厉害的工程师并不使用你的 IDE 没什么关系，然而如今由于 Internet 的存在他们近在咫尺，这意味着你必须在工具的选择上有所考量。如果你根据别人使用 Atom、Visual Studio 或者 Emacs 来嘲笑别人，那你就是不擅社交。你应当尽可能的包容，或者付出不这么做的代价。

- Go 自带代码格式化工具（译注：[`gofmt`](https://golang.org/cmd/gofmt/)）。我并不关心你是保存后自动格式化或是点一个按键或是运行 `go fmt` 来使用它，结果都是一样的——而这无疑是个了不起而且「现代」的主意，这是一种进步。所有的程序语言都应该强迫用户使用统一的格式，避免 [bikeshedding](https://en.wiktionary.org/wiki/bikeshedding)。我知道 Java 有编码风格规范，但仅仅有规范是不够的，我们应该有个工具，把原代码作为输入并产生统一格式的输出，包括单行字符数，包括空格数量等等等等。

目标是避免一切可能的关于代码格式的讨论并且有简单易用的工具来产生统一的格式。这一点非常非常的重要。

- Rust, Go, Swift 这样的语言都有自带的包管理系统。以 Swift 为例，我可以新建一个 `Package.swift` 的文件放到项目根目录然后声明它的依赖：

```
import PackageDescription

let package = Package(
    name: "SwiftBitsetBenchmark",
    dependencies: [
   .Package(url: "https://github.com/lemire/SwiftBitset.git",  
          majorVersion: 0),
   .Package(url: "https://github.com/lemire/Swimsuit.git",  
          majorVersion: 0)
    ]
)
```

（[源码](https://github.com/lemire/SwiftBitsetBenchmark)）

之后运行 `swift build` 就能自动配置依赖并打包创建程序。无论你选择文本编辑器或者是 IDE，只要有 Swift 的地方这段代码都能运行。

你不喜欢编辑器而想用图形界面？没关系，因为两者在结果上没什么区别。

为什么这是「现代」的？因为自动处理包依赖对20年前的我来说近乎奇迹，而系统性的解决这个问题又十分的重要。我不想手动安装、部署项目依赖的软件，我希望其他人能够只花几秒钟就能把我的软件库加进他们的项目中，而不是几分钟乃至几个小时。

我知道你可以把这个功能加入现有的语言中（比如针对 Java 的 Maven 或者某些 IDE），但一定要有统一的方式来管理。

- 同样以 Go、Swift 和 Rust 举例，它们从语言创建之初就支持单元测试。在 Go 里，新建一个 `myproject_test.go` 文件然后加入 `func TestMyStuff(t *testing.T)` 再运行 `go test` 即可。20年前没什么人会测试自己写的代码，而在今天代码测试是必须的，同时最好有一套统一的规范，让你在不同的项目中立刻知道如何测试代码。

如果不能第一时间看到你代码里合理的单元测试，我会假设它有严重的问题。

- 持续集成 (Continuous Integration, CI)。你希望有一个远程的工具来测试不断更新的代码来尽早探查到失败的回归测试。仅仅可以让别人测试你的代码是不够的，他们也需要看到自动化测试的结果并能轻松定位到失败的地方。

CI 体现了另一个更宽大的构想 ：你应当尽可能的自动化。减少人工操作，如果能自动化到只需要点一个按钮，那就不要重复一系列复杂的命令（无论是图形界面还是命令行）。

- 版本管理。20年前，写完代码后通过邮件发送可以理解，但也只应该发生在合作的进度比较慢的时候。今天如果这么做的话那一定是疯了。任何不是 Git 的方法都是历史的退步，要知道甚至如今的微软都在用 Git 管理开发 Windows。

******

所以，从聪明但是从未了解过现代编程技巧的学生身上我发现了什么呢？当看到 `go get` 时他们只看到了表象（一行命令而已），他们认为这才是历史的退步：帅气的图形界面去哪儿了？

他们会用好看的 IDE 比如 Visual Studio 比如 Eclipse 然后觉得自己很「现代」，完全没有意识到 IDE 在几十年前就有了。同时他们并不会善于利用 IDE 的长处来实践现代编程的技巧，而是坚持老派的编程方式：

- 没有测试。至少没有自动化、系统化的测试。
- 在项目开始时手动硬编码依赖。
- 没有自动化。没有持续集成。没有自动部署。

他们和几十年前的我用 [Turbo Pascal](https://photos.app.goo.gl/WcxNIutwtWmFTdzL2) 编程一样，除开图形界面，都很老派。


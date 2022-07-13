---
author: NoManPlay
title: R-Tree
description: R-Tree
date: 2022-07-11
tags: ['数据结构']
categories: ['学习总结']
---

# R-Tree

## 认识 R-Tree

B-Tree[^1]的搜索本质是一维区间的划分过程，每次搜索节点就是一个子区间。

R-Tree 是把 B-Tree 的思想拓展到多维空间，采用了 B-Tree 分割空间的思想，是一棵用来存储高维数据的平衡树[^2]。

{{< mermaid >}}
graph TB
level3(level3)-->level2_1(level2_1)
level3(level3)-->level2_2(level2_2)
level2_1(level2_1)-->level1_1(level1_1)
level2_1(level2_1)-->level1_2(level1_2)
level2_2(level2_2)-->level1_3(level1_3)
level2_2(level2_2)-->level1_4(level1_3)
{{< /mermaid >}}

对于 R-Tree 来说，叶子结点所在层级称为 _level 1_ ,根结点所在层级称为 _level h_ ,R-tree 满足以下性质：

1. 所有非根节点包含 _m-M_ 个记录索引（条目）。根结点的记录数可以小于 _m_。通常 m= $\frac{M}{2}$
2. 每一个非叶子结点的分支数和该节点内的条目相同，一个条目对应一个分支，所有叶子节点都位于同一层，因此 R-Tree 为平衡树
3. 叶子结点的每一个条目表示一个点
4. 非叶子结点的每一个条目存放的数据结构为`(I,child-pointer)`。`child-pointer`是指向该条目对应孩子节点的指针，*I*表示一个 n 维空间的最小矩形边界`(minimum bounding rectangle 即 MBR)`，*I*覆盖了该条目对应子树中所有的矩形或点

![mbr](https://s2.loli.net/2022/01/24/yfkvQDZR5wtSWBC.png)

两个黑点保存在一个页子节点的两个条目中，恰好框住这两个条目的矩形表示为 $I=(I_0,I_1)$。其中$I_0=(a,b)$，$I_1=(c,d)$，也就是说最小边界矩形是用各个维度的边表示，那么在三维空间中就是立方体，用 3 条边表示即可。

[^1]: https://en.wikipedia.org/wiki/B-tree
[^2]: 平衡树是计算机科学中的一类数据结构，为改进的二叉查找树。一般的二叉查找树的查询复杂度取决于目标结点到树根的距离（即深度），因此当结点的深度普遍较大时，查询的均摊复杂度会上升。为了实现更高效的查询，产生了。在平衡树这里，平衡指所有叶子的深度趋于平衡，更广义的是指在树上所有可能查找的均摊复杂度偏低。
